import { db } from "@/db";
import {
  orderItemsTable,
  ordersTable,
  productsTable,
  variantsTable,
} from "@/db/schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const main = async () => {
  try {
    console.log("Clearing database...");
    await db.delete(orderItemsTable);
    await db.delete(ordersTable);
    await db.delete(variantsTable);
    await db.delete(productsTable);
    console.log("Database cleared.");
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

// Only run main if the script is executed directly
if (require.main === module) {
  main().then(() => {
    process.exit(0);
  });
} 