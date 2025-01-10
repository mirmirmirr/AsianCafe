from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db import connection
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view

from . import utils
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

def get_menu(request):
  with connection.cursor() as cursor:
    cursor.execute(
      """
        SELECT 
          mi.menu_item_id AS id,
          ms.title AS section_title, 
          ms.description AS section_description,
          mss.title AS subsection_title,
          mss.description AS subsection_description,
          mic.menu_item_code as item_code,
          mi.menu_item_name, 
          mi.price, 
          mi.spicy, 
          mi.description AS item_description
        FROM menu_item mi
          LEFT JOIN menu_item_code mic USING (menu_item_id)
          LEFT JOIN menu_section ms USING (menu_section_id)
          LEFT JOIN menu_subsection mss USING (menu_subsection_id)
          ORDER BY ms.menu_section_id, mss.menu_subsection_id, mi.menu_item_id;
    """)
    rows = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
    
  items = [dict(zip(column_names, row)) for row in rows]

  return JsonResponse({"menu": utils.format_menu(items)})

def get_extras(request, itemID):
  with connection.cursor() as cursor:
    cursor.execute ("""
      WITH addon_codes AS (
        SELECT addon_category_id
        FROM menu_addon
          LEFT JOIN menu_item_code USING (menu_item_id)
        WHERE menu_item_code = %s
      )
      SELECT
        a.addon_id as id,
        ac.title AS category_title,
        a.addon_name,
        a.price,
        a.get_quantity
      FROM addon a
        JOIN addon_category ac USING (addon_category_id)
        JOIN addon_codes ad ON a.addon_category_id = ad.addon_category_id;
      """, [itemID])
    rows = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
  items = [dict(zip(column_names, row)) for row in rows]
  return JsonResponse({"extras" : utils.format_extras(items)})

class AddOrderItemView(APIView):
  def post(self, request):
    if request.method == 'POST':
      try:
        print(request.COOKIES)
        print(request.headers)

        print(f"Session Key: {request.session.session_key}")
        print(f"Session Data: {request.session.items()}") 

        user = request.user if request.user.is_authenticated else None

        session = request.session
        order_id = session.get('order_id')

        # checking if there is an active session order
        if order_id:
          print(order_id)
          order = Order.objects.filter(id=order_id, is_active=True).first()
          if not order:
            print("2")
            order = Order.objects.create(user=user)
            session["order_id"] = order.id
            session.save()
        else:
          print("3 new session..")
          order = Order.objects.create(user=user)
          session["order_id"] = order.id
          session.save()
          print(f"Session Key: {request.session.session_key}")
          print(f"Session Data: {request.session.items()}") 

        
        # add the new order item
        data = request.data
        print(data)
        order_item = OrderItem.objects.create(
          order=order,
          menu_item_id=data['menu_item_id'],
          total_price=data['total_price'],
          extras=data.get('extras', {}),
          quantity=data['quantity']
        )

        print(f"Session Key: {request.session.session_key}")
        print(f"Session Data: {request.session.items()}") 

        return JsonResponse({"message": "Order item added successfully!", "order_id": order.id}, status=status.HTTP_201_CREATED)
      except Exception as e:
        return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
      return JsonResponse({"This is only for adding an item to the current order."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_order_item(request, order_item_id):
  try:
      order_item = OrderItem.objects.get(id=order_item_id)
      order_item.delete()
      return JsonResponse({"message": "Order item deleted successfully!"}, status=status.HTTP_200_OK)
  except OrderItem.DoesNotExist:
      raise NotFound("Order item does not exist.")

class CheckoutView(APIView):
    def post(self, request):
        session = request.session
        order_id = session.pop("order_id", None)

        if order_id:
            order = Order.objects.get(id=order_id)
            order.is_active = False
            order.save()

        return JsonResponse({"message": "Checkout successful!"}, status=status.HTTP_200_OK)

class GetOrderView(APIView):
  def get(self, request):
    try:
      print(f"Session Key: {request.session.session_key}")
      print(f"Session Data: {request.session.items()}") 
      
      print("trying")
      session = request.session
      order_id = session.get('order_id')
      
      print("trying 2 ", order_id)
      # order = Order.objects.get(id=order_id)
      # serializer = OrderSerializer(order)

      # if order_id: 
      #   print("order_id: ", order_id)

      with connection.cursor() as cursor:
        cursor.execute ("""
          WITH orderitems AS (
            SELECT 
              oi.id,
              o.id as order_id,
              oi.quantity,
              oi.menu_item_id,
              oi.total_price,
              oi.extras
            FROM api_order as o
              LEFT JOIN api_orderitem as oi ON o.id = oi.order_id
            WHERE o.id = %s
          )
          SELECT
            oi.id,
            oi.order_id,
            oi.total_price,
            oi.extras,
            oi.quantity,
            mi.menu_item_name,
            mic.menu_item_code
          FROM orderitems as oi
            LEFT JOIN menu_item as mi USING (menu_item_id)
            LEFT JOIN menu_item_code as mic USING (menu_item_id)
          ORDER BY oi.id ASC;
          """, [order_id])
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
      items = [dict(zip(column_names, row)) for row in rows]
      print("got rows")
      return JsonResponse({"order" : items})
      # else:
      #   print("no order")
      #   return JsonResponse({"no order yet"})
      
    except Exception as e:
      print("Error:", str(e))
      return JsonResponse({"error": f"Failed to fetch order: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)