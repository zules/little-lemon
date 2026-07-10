import * as SQLite from "expo-sqlite";

let dbPromise;
function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync("little_lemon");
  return dbPromise;
}

export async function initializeDb() {
  const db = await getDb();
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL, price TEXT, description TEXT, image TEXT, category TEXT);
        `);
}

export async function saveToMenuDb(items) {
  const db = await getDb();
  const statement = await db.prepareAsync(
    `INSERT INTO menu (name, price, description, image, category)
        VALUES ($name, $price, $description, $image, $category)`,
  );
  try {
    for (const item of items) {
      const { name, price, description, image, category } = item;
      await statement.executeAsync({
        $name: name,
        $price: price,
        $description: description,
        $image: image,
        $category: category,
      });
    }
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getMenuDb() {
  const db = await getDb();
  return db.getAllAsync("SELECT * FROM menu");
}

export async function filterMenuDb(activeCats, searchTerm) {
  const db = await getDb();
  const clauses = [];
  const params = [];
  if (activeCats.length > 0) {
    clauses.push(`category IN (${activeCats.map(() => "?").join(", ")})`);
    params.push(...activeCats);
  }
  if (searchTerm) {
    clauses.push(`name LIKE ?`);
    params.push(`%${searchTerm}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db.getAllAsync(`SELECT * FROM menu ${where}`, params);
}
