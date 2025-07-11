import StatCard from "@/components/StatCard";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overview Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Sales" value="$0.00" description="No sales yet" />
        <StatCard title="Total Orders" value="0" description="No orders yet" />
        <StatCard
          title="Average Order Value"
          value="$0.00"
          description="No orders yet"
        />
        <StatCard
          title="Top Selling Product"
          value="N/A"
          description="No sales data"
        />
      </div>
    </div>
  );
} 