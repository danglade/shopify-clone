"use server";

import { db } from "@/db";
import {
  ordersTable,
  orderItemsTable,
  variantsTable,
  productsTable,
} from "@/db/schema";
import { CartItem } from "@/store/cart";
import { eq, sql, count, sum, desc, gte, lte, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { DateRange } from "react-day-picker";

export async function getDashboardStats(dateRange?: DateRange) {
  const rangeCondition =
    dateRange?.from && dateRange?.to
      ? and(
          gte(ordersTable.createdAt, dateRange.from),
          lte(ordersTable.createdAt, dateRange.to)
        )
      : undefined;

  const totalSalesData = await db
    .select({
      totalSales: sum(sql`CAST(orders.total AS numeric)`),
      totalOrders: count(ordersTable.id),
    })
    .from(ordersTable)
    .where(rangeCondition);

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
    .leftJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
    .where(rangeCondition)
    .groupBy(orderItemsTable.variantId)
    .orderBy(desc(sql`sum(quantity)`))
    .limit(1);

  let topSellingProduct = "N/A";

  if (topSoldVariantData.length > 0) {
    const topVariantId = topSoldVariantData[0].variantId;
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

  return {
    totalSales,
    totalOrders,
    averageOrderValue,
    topSellingProduct,
  };
}

export async function getChartData(dateRange?: DateRange) {
  const { from, to } = dateRange || {};

  const salesData = await db
    .select({
      date: sql<string>`DATE_TRUNC('day', ${ordersTable.createdAt})`,
      sales: sql<number>`sum(${ordersTable.total})`.mapWith(Number),
    })
    .from(ordersTable)
    .where(
      and(
        from ? gte(ordersTable.createdAt, from) : undefined,
        to ? lte(ordersTable.createdAt, to) : undefined
      )
    )
    .groupBy(sql`DATE_TRUNC('day', ${ordersTable.createdAt})`)
    .orderBy(sql`DATE_TRUNC('day', ${ordersTable.createdAt})`);

  const ordersData = await db
    .select({
      date: sql<string>`DATE_TRUNC('day', ${ordersTable.createdAt})`,
      orders: sql<number>`count(${ordersTable.id})`.mapWith(Number),
    })
    .from(ordersTable)
    .where(
      and(
        from ? gte(ordersTable.createdAt, from) : undefined,
        to ? lte(ordersTable.createdAt, to) : undefined
      )
    )
    .groupBy(sql`DATE_TRUNC('day', ${ordersTable.createdAt})`)
    .orderBy(sql`DATE_TRUNC('day', ${ordersTable.createdAt})`);

  return { salesData, ordersData };
}

export async function getTopSellingProducts(dateRange?: DateRange) {
  const { from, to } = dateRange || {};

  const topProducts = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      unitsSold: sql<number>`sum(${orderItemsTable.quantity})`.mapWith(Number),
      revenue: sql<number>`sum(${orderItemsTable.price} * ${orderItemsTable.quantity})`.mapWith(Number),
    })
    .from(orderItemsTable)
    .leftJoin(variantsTable, eq(orderItemsTable.variantId, variantsTable.id))
    .leftJoin(productsTable, eq(variantsTable.productId, productsTable.id))
    .leftJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
    .where(
      and(
        from ? gte(ordersTable.createdAt, from) : undefined,
        to ? lte(ordersTable.createdAt, to) : undefined
      )
    )
    .groupBy(productsTable.id, productsTable.name)
    .orderBy(desc(sql<number>`sum(${orderItemsTable.quantity})`))
    .limit(5);

  return topProducts;
}

type OrderPayload = {
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: string;
};

export async function createOrder({
  customerName,
  customerEmail,
  items,
  total,
}: OrderPayload) {
  try {
    await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(ordersTable)
        .values({
          customerName,
          customerEmail,
          total,
          status: "pending",
        })
        .returning();

      const orderItems = items
        .filter((item) => item.variant.id)
        .map((item) => ({
          orderId: newOrder.id,
          variantId: item.variant.id!,
          quantity: item.quantity,
          price: item.product.price,
        }));

      if (orderItems.length > 0) {
        await tx.insert(orderItemsTable).values(orderItems);
      }
    });
  } catch (error) {
    console.error("Database transaction failed", error);
    throw new Error("Failed to create order.");
  }
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = parseInt(formData.get("orderId") as string);
  const status = formData.get("status") as string;

  if (!orderId || !status) {
    throw new Error("Invalid arguments for updating order status.");
  }

  await db
    .update(ordersTable)
    .set({ status })
    .where(eq(ordersTable.id, orderId));

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
} 