import dotenv from "dotenv";
import { db } from "../src/db";
import {
  productsTable,
  variantsTable,
  categoriesTable,
  productToCategoriesTable,
  reviewsTable,
  orderItemsTable,
} from "../src/db/schema";
import { sql } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

async function clearDatabase() {
  console.log("Clearing the database...");

  try {
    // We need to delete from tables with foreign keys first
    // to avoid constraint violations.
    // Drizzle does not yet support TRUNCATE ... CASCADE, so we delete manually.
    await db.delete(productToCategoriesTable);
    await db.delete(reviewsTable);
    await db.delete(orderItemsTable);
    await db.delete(variantsTable);
    await db.delete(productsTable);
    await db.delete(categoriesTable);
    
    // Reset sequences for auto-incrementing IDs
    await db.execute(sql`ALTER SEQUENCE products_id_seq RESTART WITH 1;`);
    await db.execute(sql`ALTER SEQUENCE variants_id_seq RESTART WITH 1;`);
    await db.execute(sql`ALTER SEQUENCE categories_id_seq RESTART WITH 1;`);
    await db.execute(sql`ALTER SEQUENCE reviews_id_seq RESTART WITH 1;`);
    await db.execute(sql`ALTER SEQUENCE order_items_id_seq RESTART WITH 1;`);


    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing the database:", error);
  } finally {
    process.exit(0);
  }
}

clearDatabase(); 