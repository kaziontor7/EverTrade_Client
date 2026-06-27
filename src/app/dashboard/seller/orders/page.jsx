"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Mocking seller orders by using the same mock orders array
        const allOrders = await mockApi.getBuyerOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">Sales History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track orders placed by buyers for your listings.</p>
      </div>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Manage Incoming Orders</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">You haven't made any sales yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm">
                  <th className="pb-4 font-medium px-2">Order ID</th>
                  <th className="pb-4 font-medium px-2">Product</th>
                  <th className="pb-4 font-medium px-2">Buyer ID</th>
                  <th className="pb-4 font-medium px-2">Date</th>
                  <th className="pb-4 font-medium px-2">Earnings</th>
                  <th className="pb-4 font-medium px-2">Status</th>
                  <th className="pb-4 font-medium px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {orders.map((order) => {
                  
                  const getNextStatus = (current) => {
                    if (current === 'Pending') return 'Accepted';
                    if (current === 'Accepted') return 'Processing';
                    if (current === 'Processing') return 'Shipped';
                    if (current === 'Shipped') return 'Delivered';
                    return null;
                  };
                  
                  const nextStatus = getNextStatus(order.status || 'Pending');

                  return (
                    <tr key={order._id} className="text-gray-800 dark:text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2 font-mono text-sm text-gray-500 dark:text-gray-500">{order._id}</td>
                      <td className="py-4 px-2 font-medium text-gray-900 dark:text-white">{order.productTitle}</td>
                      <td className="py-4 px-2 font-mono text-sm">{order.buyerId}</td>
                      <td className="py-4 px-2 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="py-4 px-2 text-emerald-600 dark:text-emerald-400 font-bold">৳{order.price.toLocaleString()}</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                          order.status === 'Declined' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' :
                          'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          {nextStatus && order.status !== 'Declined' && (
                            <button
                              onClick={() => {
                                const updatedOrders = orders.map(o => o._id === order._id ? { ...o, status: nextStatus } : o);
                                setOrders(updatedOrders);
                              }}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              Mark as {nextStatus}
                            </button>
                          )}
                          {(!order.status || order.status === 'Pending') && (
                            <button
                              onClick={() => {
                                const updatedOrders = orders.map(o => o._id === order._id ? { ...o, status: 'Declined' } : o);
                                setOrders(updatedOrders);
                              }}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              Decline
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
