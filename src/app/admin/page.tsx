import { getDashboardStats } from "@/app/actions/orders";
import StatCard from "@/components/StatCard";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overview Dashboard</h1>
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
    </div>
  );
} 