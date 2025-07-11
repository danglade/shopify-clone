"use client";

import { useCartStore } from "@/store/cart";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createOrder } from "@/app/actions/orders";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

function OrderSummary() {
  const { items } = useCartStore();
  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.quantity * parseFloat(item.product.price),
      0
    );
  }, [items]);

  const total = subtotal;

  return (
    <div className="w-full lg:w-2/5 bg-slate-50 p-8 lg:p-12 border-l border-gray-200">
      <div className="space-y-4">
        {items.map((item) => {
          const imageSrc = item.variant.image || item.product.images?.[0]?.url;
          return (
            <div
              key={item.variant.id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  {imageSrc && (
                    <Image
                      src={
                        imageSrc.startsWith("//")
                          ? `https:${imageSrc}`
                          : imageSrc
                      }
                      alt={item.product.name}
                      layout="fill"
                      className="object-cover"
                    />
                  )}
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-sm">{item.product.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.variant.color} / {item.variant.size}
                  </p>
                </div>
              </div>
              <p className="text-sm">
                ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <Separator className="my-6" />

      <div className="flex gap-4">
        <Input placeholder="Discount code or gift card" />
        <Button variant="secondary">Apply</Button>
      </div>

      <Separator className="my-6" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="text-muted-foreground">Enter shipping address</span>
        </div>
      </div>
      
      <Separator className="my-6" />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>
          <span className="text-sm text-muted-foreground">USD</span> ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.quantity * parseFloat(item.product.price),
      0
    );
  }, [items]);

  async function handlePlaceOrder(formData: FormData) {
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    try {
      await createOrder({
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        items: items,
        total: subtotal.toFixed(2),
        shippingAddress: {
          line1: formData.get("address") as string,
          line2: formData.get("apartment") as string,
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          postalCode: formData.get("zip") as string,
          country: formData.get("country") as string,
        },
      });
      clearCart();
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("There was an error placing your order. Please try again.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl">Your cart is empty.</h1>
        <p>Add some products to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-3/5 p-8 lg:p-20">
        <h1 className="text-4xl font-bold tracking-wider text-center mb-8">YOUNGLA</h1>
        
        {/* Express Checkout */}
        <div className="text-center">
            <p className="text-sm mb-2">Express checkout</p>
            <div className="flex justify-center gap-2">
                <div className="bg-[#5a31f4] p-2 rounded-md w-32 h-12 text-white font-bold flex items-center justify-center">shopPay</div>
                <div className="bg-[#ffc439] p-2 rounded-md w-32 h-12 text-black font-bold flex items-center justify-center">PayPal</div>
                <div className="bg-black p-2 rounded-md w-32 h-12 text-white font-bold flex items-center justify-center">G Pay</div>
                <div className="bg-[#0074e4] p-2 rounded-md w-32 h-12 text-white font-bold flex items-center justify-center">venmo</div>
            </div>
        </div>

        <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form action={handlePlaceOrder} className="space-y-4">
          <div className="flex justify-between items-baseline">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-sm">Have an account? <a href="#" className="underline">Log in</a></p>
          </div>
          <Input id="email" name="email" type="email" required placeholder="Email"/>
          <div className="flex items-center space-x-2">
            <Checkbox id="email-signup" />
            <Label htmlFor="email-signup" className="text-xs">Sign up for emails to receive 15% off and be the first to hear about new drops</Label>
          </div>

          <h2 className="text-xl font-semibold pt-6">Delivery</h2>
           <Select name="country" defaultValue="US">
                <SelectTrigger>
                    <SelectValue placeholder="Country/Region" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex gap-4">
                <Input name="firstName" placeholder="First name" className="flex-1" required/>
                <Input name="lastName" placeholder="Last name" className="flex-1" required/>
            </div>
            <Input name="company" placeholder="Company (optional)" />
            <Input name="address" placeholder="Address" required/>
            <Input name="apartment" placeholder="Apartment, suite, etc. (optional)" />
            <div className="flex gap-4">
                <Input name="city" placeholder="City" className="flex-1" required/>
                 <Select name="state" defaultValue="FL">
                    <SelectTrigger>
                        <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="FL">Florida</SelectItem>
                        {/* Add other states */}
                    </SelectContent>
                </Select>
                <Input name="zip" placeholder="ZIP code" className="flex-1" required/>
            </div>
             <Input name="phone" placeholder="Phone" />

            <div className="flex items-center space-x-2">
                <Checkbox id="text-signup" />
                <Label htmlFor="text-signup" className="text-xs">Sign up for texts to receive 15% off and be the first to hear about new drops</Label>
          </div>

          {/* This button is implicitly the submit button for the form */}
           <div className="flex justify-end pt-4">
             <Button type="submit" size="lg">
                Continue to payment
            </Button>
           </div>
        </form>
      </div>

      <OrderSummary />
    </div>
  );
} 