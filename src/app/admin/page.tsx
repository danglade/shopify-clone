import { getDashboardStats } from "@/app/actions/orders";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { unstable_noStore as noStore } from "next/cache";

export default async function AdminDashboard() {
  noStore();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Total Sales</CardDescription>
              <CardTitle>${stats.totalSales.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Orders</CardDescription>
              <CardTitle>{stats.totalOrders.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Average Order Value</CardDescription>
              <CardTitle>${stats.averageOrderValue.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Top Selling Product</CardDescription>
              <CardTitle className="truncate">
                {stats.topSellingProduct}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <p>Could not load dashboard stats.</p>
      )}
    </div>
  );
} 