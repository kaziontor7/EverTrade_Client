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
        <div className="w-10 h-10 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const shippingCost = 15;
  const total = cartTotal + shippingCost;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] py-12 px-4 sm:px-6 lg:px-8 relative font-inter">
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-outfit mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-zinc-300 dark:text-zinc-700 mb-6 block">shopping_cart</span>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">Your cart is empty.</h2>
            <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover premium pre-owned items.</p>
            <Link href="/products" className="inline-block px-8 py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-lg rounded-xl transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 flex flex-col">
              {cartItems.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-8 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 border border-zinc-200 dark:border-zinc-800">
                    <Image 
                      src={typeof item.images === 'string' ? item.images : (item.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80")} 
                      alt={item.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col h-full justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-zinc-900 dark:text-white line-clamp-1 tracking-tight">{item.title}</h3>
                      <p className="text-sm font-medium text-zinc-500 mt-1">{item.category}</p>
                      <p className="text-zinc-900 dark:text-white font-black mt-2 text-xl">${item.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto h-full gap-4">
                    <button 
                      onClick={() => removeFromCart(item.productId || item._id)}
                      className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-colors flex items-center justify-center"
                      title="Remove from cart"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <button 
                        onClick={() => updateQuantity(item.productId || item._id, item.cartQuantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="font-bold text-zinc-900 dark:text-white w-4 text-center">{item.cartQuantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId || item._id, item.cartQuantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
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
              <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 lg:p-8 sticky top-24">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">Order Summary</h2>
                
                <div className="space-y-4 py-6 border-t border-b border-zinc-200 dark:border-zinc-800/50">
                  <div className="flex justify-between text-zinc-500 font-medium">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 dark:text-white">${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-zinc-900 dark:text-white">${shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 font-medium">
                    <span>Estimated Delivery</span>
                    <span className="text-zinc-900 dark:text-white">3-5 Business Days</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-6 mb-8">
                  <span className="text-lg font-bold text-zinc-500">Total</span>
                  <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">${total.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
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
