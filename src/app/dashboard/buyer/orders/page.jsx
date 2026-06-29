"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`${API_URL}/orders/buyer/${session.user.id}`);
          if (res.ok) {
            const userOrders = await res.json();
            setOrders(userOrders);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchOrders();
  }, [session]);

  const handleCancelOrder = async (orderId) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        const updatedOrders = orders.map(o => o._id === orderId ? { ...o, orderStatus: 'cancelled' } : o);
        setOrders(updatedOrders);
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-outfit">My Orders</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">View and manage your recent purchases.</p>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-400 text-3xl">shopping_cart</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm">
                  <th className="pb-4 font-medium px-4 whitespace-nowrap">Order ID</th>
                  <th className="pb-4 font-medium px-4 whitespace-nowrap">Product</th>
                  <th className="pb-4 font-medium px-4 whitespace-nowrap text-center">Qty</th>
                  <th className="pb-4 font-medium px-4 whitespace-nowrap">Date</th>
                  <th className="pb-4 font-medium px-4 whitespace-nowrap text-right">Price</th>
                  <th className="pb-4 font-medium px-4 whitespace-nowrap text-center">Status</th>
                  <th className="pb-4 font-medium px-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="text-gray-800 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm text-gray-500">{order._id}</td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{order.title}</td>
                    <td className="py-4 px-4 text-center">{order.quantity || 1}</td>
                    <td className="py-4 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-bold text-right">${order.price?.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block capitalize ${
                        order.orderStatus === 'completed' || order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        order.orderStatus === 'cancelled' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' :
                        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}>
                        {order.orderStatus || 'processing'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {(!order.orderStatus || order.orderStatus === 'processing' || order.orderStatus === 'pending') && (
                        <button 
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-sm px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {(order.orderStatus && order.orderStatus !== 'processing' && order.orderStatus !== 'pending') && (
                        <span className="text-sm text-gray-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
