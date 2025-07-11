"use client";

import Link from "next/link";
import { ShoppingCart, User, Search } from "lucide-react";
import Cart from "./Cart";
import { useCartStore } from "@/store/cart";
import { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left Section */}
          <div className="text-sm text-gray-600">
            <p>QUESTIONS? (818) 206-8764</p>
          </div>

          {/* Center Section */}
          <div className="text-center">
            <Link href="/" className="text-4xl font-bold text-gray-900 tracking-wider">
              YOUNGLA
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button>
              <User className="h-6 w-6" />
            </button>
            <button>
              <Search className="h-6 w-6" />
            </button>
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
            {/* Country/Currency selector placeholder */}
            <div className="text-sm">US ▾</div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex justify-center">
          {children}
        </div>
      </div>
    </header>
  );
} 