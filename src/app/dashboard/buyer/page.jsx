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
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">{session?.user?.name || "Shopper"}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Here is a summary of your recent shopping activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 font-outfit">{loading ? "..." : orders.length}</h3>
          </div>
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <span className="material-symbols-outlined text-3xl">shopping_bag</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Wishlist Items</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 font-outfit">{loading ? "..." : wishlistCount}</h3>
          </div>
          <div className="w-14 h-14 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/20">
            <span className="material-symbols-outlined text-3xl">favorite</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">Recent Purchases</h2>
          <Link href="/dashboard/buyer/orders" className="text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:underline">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recentPurchases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</p>
            <Link href="/products" className="mt-4 inline-block btn-primary py-2 px-6 rounded-xl">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPurchases.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center text-gray-500">
                    <span className="material-symbols-outlined">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{order.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">${order.price?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{order.orderStatus}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
