import { db } from "@/db";
import {
  productsTable,
  variantsTable,
  ordersTable,
  orderItemsTable,
  categoriesTable,
  productToCategoriesTable,
} from "@/db/schema";
import { faker } from "@faker-js/faker";
import { slugify } from "@/lib/utils";
import dotenv from "dotenv";
import { main as clearDatabase } from "./clear";

dotenv.config({ path: ".env.local" });

const seedDatabase = async () => {
  try {
    // 1. Clear existing data
    await clearDatabase();

    // 2. Seed Categories
    console.log("Seeding categories...");
    const categories = [];
    const categoryNames = ["T-Shirts", "Hoodies", "Pants", "Shorts", "Hats"];
    for (const name of categoryNames) {
      categories.push({
        name,
        slug: slugify(name),
        description: faker.lorem.sentence(),
      });
    }
    const insertedCategories = await db
      .insert(categoriesTable)
      .values(categories)
      .returning();
    console.log("Categories seeded.");

    // 3. Seed Products and Variants
    console.log("Seeding products and variants...");
    const products = [];
    for (let i = 0; i < 20; i++) {
      const name = faker.commerce.productName();
      products.push({
        name,
        slug: slugify(name),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        images: Array.from({ length: 3 }, () => ({
          url: faker.image.urlLoremFlickr({ category: "fashion" }),
        })),
        status: "published" as const,
      });
    }

    const insertedProducts = await db
      .insert(productsTable)
      .values(products)
      .returning();

    // Link products to categories
    for (const product of insertedProducts) {
      const numCategories = faker.number.int({ min: 1, max: 3 });
      const selectedCategories = faker.helpers.arrayElements(
        insertedCategories,
        numCategories
      );
      await db.insert(productToCategoriesTable).values(
        selectedCategories.map((category) => ({
          productId: product.id,
          categoryId: category.id,
        }))
      );
    }

    const allVariants = [];
    for (const product of insertedProducts) {
      const variants = [];
      const colors = ["Black", "White", "Red", "Blue"];
      const sizes = ["S", "M", "L", "XL"];

      for (const color of colors) {
        for (const size of sizes) {
          variants.push({
            productId: product.id,
            color,
            size,
            cost: faker.commerce.price({ min: 10, max: 40 }),
            inventory: faker.number.int({ min: 0, max: 100 }),
            sku: faker.string.alphanumeric(10).toUpperCase(),
          });
        }
      }
      const newVariants = await db
        .insert(variantsTable)
        .values(variants)
        .returning();
      allVariants.push(...newVariants);
    }
    console.log("Products and variants seeded.");

    // 4. Seed Orders
    console.log("Seeding orders...");
    const orders = [];
    for (let i = 0; i < 10; i++) {
      const orderItems: { variantId: number; quantity: number; price: string }[] =
        [];
      let total = 0;
      const numItems = faker.number.int({ min: 1, max: 5 });

      for (let j = 0; j < numItems; j++) {
        const variant = faker.helpers.arrayElement(allVariants);
        if (variant) {
          const quantity = faker.number.int({ min: 1, max: 3 });
          const price = variant.cost; // In a real app, this would be product.price
          orderItems.push({
            variantId: variant.id,
            quantity,
            price,
          });
          total += quantity * parseFloat(price);
        }
      }

      const order = await db
        .insert(ordersTable)
        .values({
          customerName: faker.person.fullName(),
          customerEmail: faker.internet.email(),
          total: total.toFixed(2),
          status: faker.helpers.arrayElement([
            "pending",
            "processing",
            "shipped",
            "delivered",
          ]),
          createdAt: faker.date.past({ years: 1 }),
        })
        .returning();

      if (order[0]) {
        const itemsToInsert = orderItems.map((item) => ({
          ...item,
          orderId: order[0].id,
        }));
        await db.insert(orderItemsTable).values(itemsToInsert);
      }
    }
    console.log("Orders seeded.");

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
};

seedDatabase(); 