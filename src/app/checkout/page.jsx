"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/lib/auth-client";
import { toast, Form, Input, Button, TextField, Label } from "@heroui/react";

export default function GlobalCheckoutPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { cartItems, cartTotal, isLoaded } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200">
        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">shopping_bag</span>
        <h2 className="text-2xl font-bold font-outfit mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">You need to add some products to your cart before you can checkout.</p>
        <Link href="/products" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold py-3 px-8 rounded-xl transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  const shippingCost = 15;
  const total = cartTotal + shippingCost;

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cartItems,
          customerEmail: session?.user?.email,
          userId: session?.user?.id
        })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error(error);
      toast.danger("Error initiating checkout: " + error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/cart" className="inline-flex items-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium mb-8 transition-colors">
          <span className="material-symbols-outlined mr-1">arrow_back</span>
          Back to Cart
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Checkout Form (Left side) */}
          <div className="w-full lg:w-2/3 space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-outfit">Secure Checkout</h1>
            
            <Form onSubmit={handleStripeCheckout} className="space-y-8" validationBehavior="native">
              {/* Shipping Information */}
              <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 lg:p-8 w-full">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <TextField isDisabled value={session?.user?.name || ""} className="md:col-span-2">
                    <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Full Name</Label>
                    <Input 
                      type="text" 
                      className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 opacity-70 rounded-lg py-3 px-3 cursor-not-allowed"
                    />
                  </TextField>
                  <TextField isRequired name="street" className="md:col-span-2">
                    <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Street Address</Label>
                    <Input 
                      type="text" 
                      placeholder="123 Main St"
                      className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors rounded-lg py-3 px-3"
                    />
                  </TextField>
                  <TextField isRequired name="city">
                    <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">City</Label>
                    <Input 
                      type="text"
                      placeholder="New York"
                      className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors rounded-lg py-3 px-3"
                    />
                  </TextField>
                  <TextField isDisabled value={session?.user?.phone || "N/A"}>
                    <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Phone Number</Label>
                    <Input 
                      type="text" 
                      className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 opacity-70 rounded-lg py-3 px-3 cursor-not-allowed"
                    />
                  </TextField>
                </div>
              </div>

              {/* Stripe Payment Integration Note */}
              <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 lg:p-8 w-full">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                    <span className="material-symbols-outlined text-zinc-900 dark:text-white">lock</span>
                    <p className="text-sm text-zinc-500">
                      You will be redirected to <strong>Stripe</strong> to securely complete your payment.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                isLoading={isProcessing}
                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-lg py-4 h-14 rounded-xl transition-colors"
              >
                {isProcessing ? "Redirecting to Stripe..." : "Proceed to Payment"}
              </Button>
            </Form>
          </div>

          {/* Order Summary (Right side) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-black/50 shrink-0 border border-gray-200 dark:border-white/10">
                      <Image src={typeof item.images === 'string' ? item.images : (item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80')} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 text-sm">{item.title}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.cartQuantity}</span>
                        <span className="text-zinc-900 dark:text-white font-black text-sm">${(item.price * item.cartQuantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 py-6 border-t border-b border-gray-200 dark:border-white/10">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">${shippingCost.toLocaleString()}</span>
                </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Estimated Delivery</span>
                    <span className="font-medium text-gray-900 dark:text-white">3-5 Business Days</span>
                  </div>
              </div>

              <div className="flex justify-between items-end mt-6">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
