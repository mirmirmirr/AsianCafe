from collections import defaultdict

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
        "desc": item["item_description"]
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
        "desc": item["item_description"]
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

if __name__ in "__main__":
  with open("backend/api/blah.json", "r") as file:
      json_data = json.load(file)
  data = format_extras(json_data)
  print(json_data)
  print(data)