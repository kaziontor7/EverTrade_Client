"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/lib/auth-client";

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

  if (!isLoaded || isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    router.push("/cart");
    return null;
  }

  const shippingCost = 15;
  const total = cartTotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartItems,
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
      alert("Error initiating checkout: " + error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/cart" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-medium mb-8 transition-colors">
          <span className="material-symbols-outlined mr-1">arrow_back</span>
          Back to Cart
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Checkout Form (Left side) */}
          <div className="w-full lg:w-2/3 space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-outfit">Secure Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
                    <input type="text" disabled value={session?.user?.name || ""} className="w-full bg-gray-100 dark:bg-black/80 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Street Address</label>
                    <input required type="text" className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="123 Main St" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">City</label>
                    <input required type="text" className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Phone Number</label>
                    <input type="text" disabled value={session?.user?.phone || "N/A"} className="w-full bg-gray-100 dark:bg-black/80 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Stripe Payment Integration Note */}
              <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20">
                    <span className="material-symbols-outlined text-blue-500 dark:text-blue-400">lock</span>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      You will be redirected to <strong>Stripe</strong> to securely complete your payment.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Redirecting to Stripe...
                  </>
                ) : (
                  `Proceed to Payment ($${total.toLocaleString()})`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary (Right side) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 sticky top-24 shadow-xl">
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
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">${(item.price * item.cartQuantity).toLocaleString()}</span>
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
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
