from collections import defaultdict

import json

def clean_menu(items):
  menu = defaultdict(lambda: {"description": "", "subsections": defaultdict(lambda: {"description": "", "items": []})} )
  
  for item in items:
    section = item['section_title']
    subsection = item["subsection_title"]

    if menu[section]["description"] == "":
      menu[section]["description"] = item["section_description"]
    
    if subsection:
      if menu[section]["subsections"][subsection]["description"] == "":
        menu[section]["subsections"][subsection]["description"] = item["subsection_description"]
      
      menu[section]["subsections"][subsection]["items"].append({
        "menu_item_name": item["menu_item_name"],
        "menu_item_code": item["item_code"],
        "price": item["price"],
        "spicy": item["spicy"],
        "item_description": item["item_description"]
      })
    else:
      if "items" not in menu[section]:
        menu[section]["items"] = []
      
      menu[section]["items"].append({
        "menu_item_name": item["menu_item_name"],
        "menu_item_code": item["item_code"],
        "price": item["price"],
        "spicy": item["spicy"],
        "item_description": item["item_description"]
      })
      
  return menu

def format_menu(items):
  menudict = clean_menu(items)

  formatted_menu = []

  for section_title, section_data in menudict.items():
    section_entry = {
      "section" : section_title,
      "section_desc" : section_data["description"],
      "subsections": []
    }

    for subsection_title, subsection_data in section_data["subsections"].items():
      subsection_entry = {
        "subsection" : subsection_title,
        "subsection_desc" : subsection_data["description"],
        "menu_items": subsection_data["items"]
      }

      section_entry["subsections"].append(subsection_entry)

    if "items" in section_data:
      section_entry["menu_items"] = section_data["items"]
  
    formatted_menu.append(section_entry)
  
  return formatted_menu

if __name__ in "__main__":
  with open("backend/api/blah.json", "r") as file:
      json_data = json.load(file)
  data = format_menu(json_data)

  print(data)