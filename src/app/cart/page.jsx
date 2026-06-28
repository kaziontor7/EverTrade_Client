"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, isLoaded } = useCart();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const shippingCost = cartItems.length > 0 ? 15 : 0;
  const tax = Math.round(cartTotal * 0.08 * 100) / 100;
  const total = cartTotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-outfit mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center shadow-xl">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 block">shopping_cart</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products" className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-black/50 shrink-0">
                    <Image 
                      src={typeof item.images === 'string' ? item.images : (item.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80")} 
                      alt={item.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col h-full justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.category}</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-2 text-xl">৳{item.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto h-full gap-4">
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      title="Remove from cart"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/30 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10">
                      <button 
                        onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="font-bold text-gray-900 dark:text-white w-4 text-center">{item.cartQuantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 sticky top-24 shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 py-4 border-t border-b border-gray-200 dark:border-white/10">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900 dark:text-white">৳{shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-gray-900 dark:text-white">৳{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-6 mb-8">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">৳{total.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 text-lg"
                >
                  <span className="material-symbols-outlined">shopping_cart_checkout</span>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
