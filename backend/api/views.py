from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db import connection
from collections import defaultdict

from . import utils

def get_menu(request):
  with connection.cursor() as cursor:
    cursor.execute(
      """
        SELECT 
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