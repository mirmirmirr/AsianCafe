from collections import defaultdict
from django.db import connection
from django.http import JsonResponse
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.exceptions import NotFound

from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

import json

def clean_menu(items):
  menu = defaultdict(lambda: {"id": -1, "description": "", "subsections": defaultdict(lambda: {"description": "", "items": []})} )
  
  for item in items:
    section = item['section_title']
    subsection = item["subsection_title"]
    section_id = item["section_id"]

    if menu[section]["description"] == "":
      menu[section]["description"] = item["section_description"]
    
    if menu[section]["id"] == -1:
      menu[section]["id"] = section_id
    
    if subsection:
      if menu[section]["subsections"][subsection]["description"] == "":
        menu[section]["subsections"][subsection]["description"] = item["subsection_description"]
      
      menu[section]["subsections"][subsection]["items"].append({
        "id": item["id"],
        "name": item["menu_item_name"],
        "code": item["item_code"],
        "price": item["price"],
        "spicy": item["spicy"],
        "desc": item["item_description"],
        "num_addons": item["num_addons"]
      })
    else:
      if "items" not in menu[section]:
        menu[section]["items"] = []
      
      menu[section]["items"].append({
        "id": item["id"],
        "name": item["menu_item_name"],
        "code": item["item_code"],
        "price": item["price"],
        "spicy": item["spicy"],
        "desc": item["item_description"],
        "num_addons": item["num_addons"]
      })
      
  return menu

def format_menu(items):
  menudict = clean_menu(items)

  formatted_menu = []

  for section_title, section_data in menudict.items():
    section_entry = {
      "section" : section_title,
      "id": section_data["id"],
      "desc" : section_data["description"],
      "subsections": []
    }

    for subsection_title, subsection_data in section_data["subsections"].items():
      subsection_entry = {
        "subsection" : subsection_title,
        "desc" : subsection_data["description"],
        "menu_items": subsection_data["items"]
      }

      section_entry["subsections"].append(subsection_entry)

    if "items" in section_data:
      section_entry["menu_items"] = section_data["items"]
  
    formatted_menu.append(section_entry)
  
  return formatted_menu

def format_extras(items):
  extras = dict()
  for item in items:
    category = item["category_title"]
    
    if category not in extras:
      extras[category] = {"category": category, "options": []}
    
    extras[category]["options"].append({
      "id": item["id"],
      "name": item["addon_name"],
      "price": item["price"],
      "get_quantity": item["get_quantity"]
    })

  return list(extras.values())

def delete_order_item(request, order_item_id):
  try:
      order_item = OrderItem.objects.get(id=order_item_id)
      order_item.delete()

      order_number = order_item.order_id
      if not OrderItem.objects.filter(order_id=order_number).exists():
          print("Deleting order #", order_number)
          Order.objects.filter(id=order_number).delete()
      return JsonResponse({"message": "Order item deleted successfully!"}, status=status.HTTP_200_OK)
  except OrderItem.DoesNotExist:
      raise NotFound("Order item does not exist.")

def get_order_item(request, order_item_id):
  try:
      print(order_item_id)
      # order = OrderItem.objects.get(id=order_item_id)
      # print(order.menu_item_id)
      
      with connection.cursor() as cursor:
        cursor.execute ("""
        SELECT
          oi.id as order_item_id,
          oi.order_id,
          mi.menu_item_id as id,
          mi.menu_item_name as name,
          oi.total_price,
          oi.special_requests,
          oi.extras,
          oi.quantity
        FROM api_orderitem oi
          LEFT JOIN menu_item mi USING (menu_item_id)
        WHERE oi.id = %s;
        """, [order_item_id])
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]

      items = [dict(zip(column_names, row)) for row in rows]
      return JsonResponse(items[0])
  except OrderItem.DoesNotExist:
      raise NotFound("Order item does not exist.")
  
def edit_order_item(request, order_item_id):
  try:
    order_item = OrderItem.objects.get(id=order_item_id)
    data = JSONParser().parse(request)
    serializer = OrderItemSerializer(order_item, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  except OrderItem.DoesNotExist:
      raise NotFound("Order item does not exist.")

if __name__ in "__main__":
  with open("backend/api/blah.json", "r") as file:
      json_data = json.load(file)
  data = format_extras(json_data)
  print(json_data)
  print(data)