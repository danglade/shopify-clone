"use server";

import { db } from "@/db";
import {
  ordersTable,
  orderItemsTable,
  variantsTable,
  Product,
  Variant,
} from "@/db/schema";
import { eq, sql, count, sum, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDashboardStats() {
  const totalSalesData = await db
    .select({
      totalSales: sum(sql`CAST(orders.total AS numeric)`),
      totalOrders: count(ordersTable.id),
    })
    .from(ordersTable);

  const stats = totalSalesData[0];
  const totalSales = Number(stats.totalSales || 0);
  const totalOrders = stats.totalOrders;

  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Find top selling product
  const topSoldVariantData = await db
    .select({
      variantId: orderItemsTable.variantId,
      totalQuantity: sum(orderItemsTable.quantity),
    })
    .from(orderItemsTable)
    .groupBy(orderItemsTable.variantId)
    .orderBy(desc(sql`sum(quantity)`))
    .limit(1);

  let topSellingProduct = "N/A";

  if (topSoldVariantData.length > 0) {
    const topVariantId = topSoldVariantData[0].variantId;
    if (topVariantId) {
      const variant = await db.query.variantsTable.findFirst({
        where: eq(variantsTable.id, topVariantId),
        with: {
          product: true,
        },
      });

      if (variant) {
        topSellingProduct = variant.product.name;
      }
    }
  }

  return {
    totalSales,
    totalOrders,
    averageOrderValue,
    topSellingProduct,
  };
}

interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  items: {
    product: Product;
    variant: Variant;
    quantity: number;
  }[];
  total: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}


export async function createOrder(payload: CreateOrderPayload) {
  const [newOrder] = await db
    .insert(ordersTable)
    .values({
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      total: payload.total,
      shippingAddressLine1: payload.shippingAddress.line1,
      shippingAddressLine2: payload.shippingAddress.line2,
      shippingCity: payload.shippingAddress.city,
      shippingState: payload.shippingAddress.state,
      shippingPostalCode: payload.shippingAddress.postalCode,
      shippingCountry: payload.shippingAddress.country,
      status: "pending",
    })
    .returning();

  const orderItems = payload.items.reduce((acc, item) => {
    if (item.variant.id) {
      acc.push({
        orderId: newOrder.id,
        variantId: item.variant.id,
        quantity: item.quantity,
        price: item.product.price,
      });
    }
    return acc;
  }, [] as (typeof orderItemsTable.$inferInsert)[]);

  if (orderItems.length > 0) {
    await db.insert(orderItemsTable).values(orderItems);
  }
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = Number(formData.get("orderId"));
  const newStatus = formData.get("status") as "pending" | "shipped" | "delivered" | "cancelled";

  await db
    .update(ordersTable)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(ordersTable.id, orderId));

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/admin/orders`);
} 

