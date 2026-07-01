"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

import { getBuyerOrders } from "@/lib/api/orders";
import { getWishList } from "@/lib/api/wishlist";

export default function BuyerDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const [ordersData, wishlistData] = await Promise.all([
            getBuyerOrders(session.user.id),
            getWishList(session.user.id)
          ]);
          
          if (ordersData) {
            setOrders(ordersData);
          }
          if (wishlistData) {
            setWishlistCount(wishlistData.length);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [session]);

  const recentPurchases = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
          Welcome back, {session?.user?.name || "Shopper"}.
        </h1>
        <p className="text-zinc-500 font-medium mt-2 text-lg">Here is a summary of your recent shopping activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 font-medium">Total Orders</p>
            <h3 className="text-4xl font-black text-zinc-900 dark:text-white mt-1 tracking-tighter">{loading ? "..." : orders.length}</h3>
          </div>
          <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">shopping_bag</span>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 font-medium">Wishlist Items</p>
            <h3 className="text-4xl font-black text-zinc-900 dark:text-white mt-1 tracking-tighter">{loading ? "..." : wishlistCount}</h3>
          </div>
          <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">favorite</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Recent Purchases</h2>
          <Link href="/dashboard/buyer/orders" className="text-zinc-900 dark:text-white font-bold text-sm hover:underline">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recentPurchases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 font-medium mb-6">You haven't placed any orders yet.</p>
            <Link href="/products" className="inline-block px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPurchases.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
                    <span className="material-symbols-outlined">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-zinc-900 dark:text-white font-bold">{order.title}</p>
                    <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-zinc-900 dark:text-white font-black">${order.price?.toLocaleString()}</p>
                  <p className="text-xs font-medium text-zinc-500">{order.orderStatus}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
