from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from rest_framework import status
from rest_framework.decorators import api_view

from . import utils
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

def ping(request):
  return JsonResponse({"status": "ok"})

@api_view(['GET'])
def get_menu(request):
  with connection.cursor() as cursor:
    cursor.execute(
      """
      SELECT 
        mi.menu_item_id AS id,
        ms.menu_section_id AS section_id,
        ms.section_title AS section_title, 
        CASE 
          WHEN ms.subsection_title IS NULL THEN ms.description 
          ELSE NULL 
        END AS section_description,
        ms.subsection_title AS subsection_title,
        CASE 
          WHEN ms.subsection_title IS NOT NULL THEN ms.description 
          ELSE NULL 
        END AS subsection_description,
        mic.menu_item_code AS item_code,
        mi.menu_item_name, 
        mi.price, 
        mi.spicy, 
        mi.description AS item_description,
        COALESCE(jsonb_array_length(mal.allowed_addons), 0) AS num_addons
      FROM menu_item mi
        LEFT JOIN menu_item_code mic USING (menu_item_id)
        LEFT JOIN menu_section ms USING (menu_section_id)
        LEFT JOIN menu_addon_list mal USING (menu_item_id)
      ORDER BY ms.menu_section_id, mi.menu_item_id;
    """)
    rows = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
    
  items = [dict(zip(column_names, row)) for row in rows]

  return JsonResponse({"menu": utils.format_menu(items)})

@api_view(['GET'])
def get_extras(request, itemID):
  with connection.cursor() as cursor:
    cursor.execute ("""
      WITH allowed_addons AS (
        SELECT addon_id
        FROM expanded_menu_addon 
        WHERE menu_item_id = %s
      )
      SELECT
        a.addon_id as id,
        ac.title AS category_title,
        a.addon_name,
        a.price,
        a.get_quantity
      FROM addon a
        JOIN addon_category ac USING (addon_category_id)
        JOIN allowed_addons aa USING (addon_id)
      ORDER BY a.addon_id;
      """, [itemID])
    rows = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
  items = [dict(zip(column_names, row)) for row in rows]
  return JsonResponse({"extras" : utils.format_extras(items)})

@api_view(['POST'])
def add_order_item(request):
  if request.method == 'POST':
    try:
      print(f"Session Key: {request.session.session_key}")

      user = request.user if request.user.is_authenticated else None

      session = request.session
      order_id = session.get('order_id')

      # checking if there is an active session order
      if order_id:
        order = Order.objects.filter(id=order_id, is_active=True).first()
        if not order:
          order = Order.objects.create(user=user)
          session["order_id"] = order.id
          session.save()
      else:
        order = Order.objects.create(user=user)
        session["order_id"] = order.id
        session.save()
      
      # add the new order item
      data = request.data
      order_item = OrderItem.objects.create(
        order=order,
        menu_item_id=data['menu_item_id'],
        total_price=data['total_price'],
        extras=data.get('extras', {}),
        quantity=data['quantity'],
        special_requests=data.get('special_requests', None)
      )
      return JsonResponse({"message": "Order item added successfully!", "order_id": order.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
      return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
  else:
    return JsonResponse({"This is only for adding an item to the current order."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE', 'PATCH'])
def order_item(request, order_item_id):
  if request.method == 'GET':
    return utils.get_order_item(request, order_item_id)
  elif request.method == 'DELETE':
    return utils.delete_order_item(request, order_item_id)
  elif request.method == 'PATCH':
    return utils.edit_order_item(request, order_item_id)

@api_view(['PATCH'])
def checkout(request):
    session = request.session
    order_id = session.pop("order_id", None)

    if order_id:
      order = Order.objects.get(id=order_id)
      order.is_active = False
      order.save()

    return JsonResponse({"message": "Checkout successful!"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_order(request):
  try:
    print(f"Session Key: {request.session.session_key}")
    
    session = request.session
    order_id = session.get('order_id')

    with connection.cursor() as cursor:
      cursor.execute ("""
        WITH orderitems AS (
          SELECT 
            oi.id,
            o.id as order_id,
            oi.quantity,
            oi.menu_item_id,
            oi.total_price,
            oi.extras,
            oi.special_requests
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
          oi.special_requests,
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
    return JsonResponse({"order" : items})
    
  except Exception as e:
    print("Error:", str(e))
    return JsonResponse({"error": f"Failed to fetch order: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)