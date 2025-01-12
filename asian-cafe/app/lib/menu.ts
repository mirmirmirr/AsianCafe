import { db } from "@vercel/postgres";

let client;
async function getClient() {
  if (!client || client.closed) {
    client = await db.connect();
  }
  return client;
}

export async function fetchSectionItems() {
  const client = await getClient();

  try {
    const data = await client.sql`
      SELECT 
        ms.title AS section_title, 
        ms.description AS section_description,
        mss.title AS subsection_title,
        mss.description AS subsection_description,
        mi.menu_item_name, 
        mi.price, 
        mi.spicy, 
        mi.description AS item_description
      FROM menu_item mi
        LEFT JOIN menu_section ms USING (menu_section_id)
        LEFT JOIN menu_subsection mss USING (menu_subsection_id)
        ORDER BY ms.menu_section_id, mss.menu_subsection_id, mi.menu_item_id;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error('Failed to fetch menu data.');
  }
}

export async function fetchExtraOptions(itemID) {
  const client = await getClient();

  try {
    const data = await client.sql`
      WITH addon_codes AS (
        SELECT addon_category_id
        FROM menu_addon
        WHERE menu_item_id = ${itemID}
      )
      SELECT
        ac.title AS category_title,
        a.addon_name,
        a.price,
        a.get_quantity
      FROM addon a
        JOIN addon_category ac USING (addon_category_id)
        JOIN addon_codes ad ON a.addon_category_id = ad.addon_category_id;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error('Failed to fetch extras data.');
  }
}