"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";
import { searchProducts } from "@/app/actions/products";
import { Product } from "@/db/schema";
import Link from "next/link";
import Image from "next/image";

type SearchBarProps = {
  onClose: () => void;
};

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        const products = await searchProducts(query);
        setResults(products);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleClose = () => {
    setQuery("");
    setResults([]);
    onClose();
  };

  return (
    <>
      {isMounted &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={handleClose}
            aria-hidden="true"
          ></div>,
          document.body
        )}

      <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50">
        <div className="container mx-auto p-4">
          <div className="flex items-center gap-4 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full p-2 border rounded-md"
            />
            <button onClick={handleClose}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            )}
            {!loading && results.length > 0 && (
              <ul className="space-y-2">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md"
                      onClick={handleClose}
                    >
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          ${product.price}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!loading && query.length > 1 && results.length === 0 && (
              <p className="text-center text-gray-500 p-4">
                No results found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 