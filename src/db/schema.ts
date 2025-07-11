import {
  pgTable,
  serial,
  text,
  varchar,
  decimal,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  productToCategories: many(productToCategoriesTable),
}));

export const typesTable = pgTable("types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
});

export const typesRelations = relations(typesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const buttonPositionEnum = pgEnum("button_position", [
  "top",
  "middle",
  "bottom",
]);

export const buttonHorizontalPositionEnum = pgEnum("button_horizontal_position", [
  "left",
  "center",
  "right",
]);

export const statusEnum = pgEnum("status", ["draft", "published", "archived"]);

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  description: text("description"),
  typeId: integer("type_id").references(() => typesTable.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  images: jsonb("images").$type<{ url: string }[]>(), // Storing images as an array of objects
  status: statusEnum("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productsRelations = relations(productsTable, ({ many, one }) => ({
  variants: many(variantsTable),
  productToCategories: many(productToCategoriesTable),
  reviews: many(reviewsTable),
  type: one(typesTable, {
    fields: [productsTable.typeId],
    references: [typesTable.id],
  }),
}));

export const productToCategoriesTable = pgTable("product_to_categories", {
  productId: integer("product_id")
    .references(() => productsTable.id)
    .notNull(),
  categoryId: integer("category_id")
    .references(() => categoriesTable.id)
    .notNull(),
});

export const productToCategoriesRelations = relations(
  productToCategoriesTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [productToCategoriesTable.productId],
      references: [productsTable.id],
    }),
    category: one(categoriesTable, {
      fields: [productToCategoriesTable.categoryId],
      references: [categoriesTable.id],
    }),
  })
);

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => productsTable.id)
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  author: varchar("author", { length: 256 }).notNull(),
  status: varchar("status", {
    length: 20,
    enum: ["pending", "approved", "rejected"],
  })
    .default("pending")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [reviewsTable.productId],
    references: [productsTable.id],
  }),
}));

export const variantsTable = pgTable("variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => productsTable.id)
    .notNull(),
  size: varchar("size", { length: 50 }).notNull(), // e.g., 'S', 'M', 'L', 'XL'
  color: varchar("color", { length: 50 }).notNull(), // e.g., 'Red', 'Blue', 'Black'
  image: varchar("image", { length: 256 }),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  sku: varchar("sku", { length: 100 }).unique(),
  inventory: integer("inventory").notNull().default(0),
});

export const variantsRelations = relations(variantsTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [variantsTable.productId],
    references: [productsTable.id],
  }),
}));

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 256 }).notNull(),
  customerEmail: varchar("customer_email", { length: 256 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ordersRelations = relations(ordersTable, ({ many }) => ({
  orderItems: many(orderItemsTable),
}));

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => ordersTable.id)
    .notNull(),
  variantId: integer("variant_id")
    .references(() => variantsTable.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at time of purchase
});

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  variant: one(variantsTable, {
    fields: [orderItemsTable.variantId],
    references: [variantsTable.id],
  }),
}));

export const settingsTable = pgTable("settings", {
  key: varchar("key", { length: 256 }).primaryKey(),
  value: text("value"),
});

export const heroSlidesTable = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("image_url", { length: 1024 }).notNull(),
  title: varchar("title", { length: 256 }),
  subtitle: varchar("subtitle", { length: 256 }),
  buttonText: varchar("button_text", { length: 256 }),
  buttonLink: varchar("button_link", { length: 1024 }),
  buttonPosition: buttonPositionEnum("button_position").default("middle"),
  buttonHorizontalPosition: buttonHorizontalPositionEnum("button_horizontal_position").default("left"),
  order: integer("order").notNull().default(0),
});

// Zod schema for validation
export const insertProductSchema = createInsertSchema(productsTable);
export const insertVariantSchema = createInsertSchema(variantsTable);

export type Product = z.infer<typeof insertProductSchema>;
export type Variant = z.infer<typeof insertVariantSchema>; 