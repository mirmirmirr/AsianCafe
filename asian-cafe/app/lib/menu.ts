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
      SELECT *
      FROM menu;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error('Failed to fetch menu data.');
  }
}

export async function fetchExtraOptions(selectedCat) {
  const client = await getClient();

  try {
    const data = await client.sql`
      SELECT option, price, priority, "getQuantity"
      FROM extras
      WHERE category = ${selectedCat}
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error('Failed to fetch extras data.');
  }
}