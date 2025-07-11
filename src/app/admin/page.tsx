"use client"

import * as React from "react";
import {
  getChartData,
  getDashboardStats,
  getTopSellingProducts,
} from "@/app/actions/orders";
import StatCard from "@/components/StatCard";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { DateRange } from "react-day-picker";
import DashboardChart from "@/components/DashboardChart";
import TopProductsTable from "@/components/TopProductsTable";
import { formatCurrency } from "@/lib/utils";

type DashboardStats = {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProduct: string;
};

type ChartData = {
  salesData: { date: string; sales: number }[];
  ordersData: { date: string; orders: number }[];
};

type TopProduct = {
  id: number;
  name: string | null;
  unitsSold: number;
  revenue: number;
};

const generateDummyChartData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      sales: Math.floor(Math.random() * 1000) + 200,
      orders: Math.floor(Math.random() * 50) + 5,
    });
  }
  return {
    salesData: data.map((d) => ({ date: d.date, sales: d.sales })),
    ordersData: data.map((d) => ({ date: d.date, orders: d.orders })),
  };
};

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [chartData, setChartData] = React.useState<ChartData | null>(null);
  const [topProducts, setTopProducts] = React.useState<TopProduct[] | null>(
    null
  );
  const [range, setRange] = React.useState<DateRange | undefined>();

  React.useEffect(() => {
    async function fetchData() {
      const [statsData, chartData, topProductsData] = await Promise.all([
        getDashboardStats(range),
        getChartData(range),
        getTopSellingProducts(range),
      ]);
      setStats(statsData);

      if (chartData.salesData.length === 0 && chartData.ordersData.length === 0) {
        setChartData(generateDummyChartData());
      } else {
        setChartData(chartData);
      }

      setTopProducts(
        topProductsData.filter(
          (p): p is TopProduct => p.id !== null && p.name !== null
        )
      );
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

      {chartData ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardChart
            data={chartData.salesData}
            dataKey="sales"
            title="Sales Over Time"
          />
          <DashboardChart
            data={chartData.ordersData}
            dataKey="orders"
            title="Orders Over Time"
          />
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}

      {topProducts ? (
        <div className="mt-8">
          <TopProductsTable products={topProducts} />
        </div>
      ) : (
        <p>Loading top products...</p>
      )}
    </div>
  );
} 