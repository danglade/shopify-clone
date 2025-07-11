import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6">
        <nav className="space-y-4">
          <Link
            href="/admin"
            className="block font-semibold text-gray-800 hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block font-semibold text-gray-800 hover:text-indigo-600"
          >
            Products
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
} 