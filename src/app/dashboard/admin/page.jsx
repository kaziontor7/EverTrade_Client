"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";
import Image from "next/image";

export default function AdminOverview() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allProducts, allUsers, allOrders] = await Promise.all([
          mockApi.getProducts(),
          mockApi.getAllUsers(),
          mockApi.getAllOrders()
        ]);
        setProducts(allProducts);
        setUsers(allUsers);
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await mockApi.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    }
  };

  const pendingSellers = users.filter(u => u.role === 'seller' && !u.isVerified).length;
  
  // Calculate Platform Revenue (e.g. 5% fee on all Delivered orders)
  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, order) => sum + (order.price * 0.05), 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">
          Admin Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor platform activity, moderate listings, and track revenue.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-500 dark:text-emerald-400">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Platform Revenue (5%)</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-500 dark:text-blue-400">
            <span className="material-symbols-outlined">group</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Users</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-500 dark:text-purple-400">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Listings</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4 text-yellow-500 dark:text-yellow-400">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{pendingSellers}</p>
          <p className="text-sm text-yellow-500 dark:text-yellow-400 mt-1">Pending Sellers</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Global Orders Monitor */}
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Global Order Monitor</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm">
                    <th className="pb-4 font-medium px-2">Order ID</th>
                    <th className="pb-4 font-medium px-2">Amount</th>
                    <th className="pb-4 font-medium px-2">Fee (5%)</th>
                    <th className="pb-4 font-medium px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {orders.map((order) => (
                    <tr key={order._id} className="text-gray-800 dark:text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2 font-mono text-sm text-gray-500">{order._id}</td>
                      <td className="py-4 px-2 font-medium">${order.price.toLocaleString()}</td>
                      <td className="py-4 px-2 text-emerald-600 dark:text-emerald-400 font-bold">
                        +${(order.price * 0.05).toLocaleString()}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          order.status === 'Cancelled' || order.status === 'Declined' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                          'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Moderation Table */}
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Product Moderation</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">No active products to moderate.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm">
                    <th className="pb-4 font-medium px-2">Product</th>
                    <th className="pb-4 font-medium px-2">Report Status</th>
                    <th className="pb-4 font-medium px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {products.slice(0, 8).map((product) => (
                    <tr key={product._id} className="text-gray-800 dark:text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100/80 dark:bg-black/50">
                            <Image src={product.images[0]} alt="" fill className="object-cover" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{product.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        {product.isReported ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                            Reported
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                            Clean
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/20"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
