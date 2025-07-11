"use client"

import * as React from "react";
import { getDashboardStats } from "@/app/actions/orders";
import StatCard from "@/components/StatCard";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { DateRange } from "react-day-picker";

type DashboardStats = {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProduct: string;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [range, setRange] = React.useState<DateRange | undefined>();

  React.useEffect(() => {
    async function fetchData() {
      const data = await getDashboardStats(range);
      setStats(data);
    }
    fetchData();
  }, [range]);


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Overview Dashboard</h1>
        <DateRangePicker
          onUpdate={({ range }) => setRange(range)}
        />
      </div>
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Sales"
            value={formatCurrency(stats.totalSales)}
            description={`${stats.totalOrders} orders`}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            description="Across all time"
          />
          <StatCard
            title="Average Order Value"
            value={formatCurrency(stats.averageOrderValue)}
            description="Average across all orders"
          />
          <StatCard
            title="Top Selling Product"
            value={stats.topSellingProduct}
            description="Based on quantity sold"
          />
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
} 