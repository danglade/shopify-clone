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

export const statusEnum = pgEnum("status", ["draft", "published", "archived"]);

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  images: jsonb("images").$type<{ url: string }[]>(), // Storing images as an array of objects
  status: statusEnum("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productsRelations = relations(productsTable, ({ many }) => ({
  variants: many(variantsTable),
}));

export const variantsTable = pgTable("variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => productsTable.id)
    .notNull(),
  size: varchar("size", { length: 50 }).notNull(), // e.g., 'S', 'M', 'L', 'XL'
  color: varchar("color", { length: 50 }).notNull(), // e.g., 'Red', 'Blue', 'Black'
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

// Zod schema for validation
export const insertProductSchema = createInsertSchema(productsTable);
export const insertVariantSchema = createInsertSchema(variantsTable);

export type Product = z.infer<typeof insertProductSchema>;
export type Variant = z.infer<typeof insertVariantSchema>; 