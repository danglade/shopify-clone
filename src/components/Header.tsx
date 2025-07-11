"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Cart from "./Cart";
import { useCartStore } from "@/store/cart";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "bg-white shadow-sm transition-all duration-300",
        isSticky ? "fixed top-0 left-0 right-0 z-50" : ""
      )}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          YOUNGLA
        </Link>
        {children}
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