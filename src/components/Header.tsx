"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Cart from "./Cart";
import { useCartStore } from "@/store/cart";

export default function Header() {
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          YOUNGLA
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/collections/for-him" className="text-sm font-medium hover:text-indigo-600">For Him</Link>
          <Link href="/collections/for-her" className="text-sm font-medium hover:text-indigo-600">For Her</Link>
          <Link href="/collections/new-drop" className="text-sm font-medium hover:text-indigo-600">New Drop</Link>
          <Link href="/collections/collabs" className="text-sm font-medium hover:text-indigo-600">Collabs</Link>
          <Link href="/collections/lookbook" className="text-sm font-medium hover:text-indigo-600">Lookbook</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Cart>
            <button className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </Cart>
        </div>
      </div>
    </header>
  );
} 