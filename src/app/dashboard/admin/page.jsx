"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getAdminStats, deleteProduct } from "@/lib/api/admin";
import { AlertDialog, Button, toast } from "@heroui/react";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setStats(prev => ({
        ...prev,
        recentProducts: prev.recentProducts.filter(p => p._id !== id)
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.danger("Failed to delete product");
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
          Admin Overview
        </h1>
        <p className="text-zinc-500 font-medium mt-2 text-lg">Monitor platform activity, moderate listings, and track revenue.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 dark:bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-brutal">
          <div className="w-12 h-12 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <p className="text-4xl font-black text-white dark:text-zinc-900 tracking-tighter">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium mt-1">Platform Revenue (5%)</p>
        </div>
        <div className="bg-zinc-900 dark:bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-brutal">
          <div className="w-12 h-12 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">group</span>
          </div>
          <p className="text-4xl font-black text-white dark:text-zinc-900 tracking-tighter">{stats.totalUsers}</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium mt-1">Total Users</p>
        </div>
        <div className="bg-zinc-900 dark:bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-brutal">
          <div className="w-12 h-12 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <p className="text-4xl font-black text-white dark:text-zinc-900 tracking-tighter">{stats.totalProducts}</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium mt-1">Active Listings</p>
        </div>
        <div className="bg-zinc-900 dark:bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-brutal">
          <div className="w-12 h-12 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <p className="text-4xl font-black text-white dark:text-zinc-900 tracking-tighter">{stats.pendingSellers}</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium mt-1">Pending Sellers</p>
        </div>
      </div>

      <div className="flex flex-col gap-12 mt-4">
        
        {/* Global Orders Monitor */}
        <div className="pt-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">Global Order Monitor</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-medium">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-max border-collapse">
                <thead>
                  <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                    <th className="pb-4 px-4 whitespace-nowrap">Order ID</th>
                    <th className="pb-4 px-4 whitespace-nowrap">Amount</th>
                    <th className="pb-4 px-4 whitespace-nowrap">Fee (5%)</th>
                    <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-6 px-4 font-mono text-sm text-zinc-500 max-w-[80px] truncate" title={order._id}>{order._id}</td>
                      <td className="py-6 px-4 font-black">${order.price?.toLocaleString()}</td>
                      <td className="py-6 px-4 font-black text-zinc-900 dark:text-white">
                        +${((order.price || 0) * 0.05).toLocaleString()}
                      </td>
                      <td className="py-6 px-4">
                        <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-bold inline-block capitalize tracking-wide">
                          {order.orderStatus || 'Pending'}
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
        <div className="pt-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">Product Moderation</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : stats.recentProducts.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-medium">No active products to moderate.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-max border-collapse">
                <thead>
                  <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                    <th className="pb-4 px-4 whitespace-nowrap">Product</th>
                    <th className="pb-4 px-4 whitespace-nowrap text-center">Report Status</th>
                    <th className="pb-4 px-4 whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {stats.recentProducts.map((product) => (
                    <tr key={product._id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 relative rounded-md overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                            {product.images && (
                              <Image 
                                src={typeof product.images === 'string' ? product.images : (product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80')} 
                                alt="" 
                                fill 
                                className="object-cover" 
                              />
                            )}
                          </div>
                          <span className="font-bold text-zinc-900 dark:text-white max-w-[150px] truncate" title={product.title}>{product.title}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-center">
                        {product.reported ? (
                          <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wide bg-zinc-900 text-white dark:bg-white dark:text-black">
                            Reported
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wide bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                            Clean
                          </span>
                        )}
                      </td>
                      <td className="py-6 px-4 text-right">
                        <AlertDialog>
                          <Button 
                            className="cursor-pointer px-4 py-2 bg-zinc-900 hover:bg-red-600 text-white font-bold text-xs rounded transition-colors uppercase tracking-wider"
                          >
                            Delete
                          </Button>
                          <AlertDialog.Backdrop>
                            <AlertDialog.Container>
                              <AlertDialog.Dialog className="rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-xl bg-white dark:bg-zinc-900 sm:max-w-[400px]">
                                <AlertDialog.CloseTrigger />
                                <AlertDialog.Header className="border-b border-zinc-200 dark:border-zinc-800/50 pb-4 pt-6">
                                  <AlertDialog.Heading className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Delete Listing?</AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body className="py-6">
                                  <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                                    This will permanently remove <strong className="text-zinc-900 dark:text-white">{product.title}</strong> from the platform.
                                  </p>
                                </AlertDialog.Body>
                                <AlertDialog.Footer className="border-t border-zinc-200 dark:border-zinc-800/50 pt-4 pb-6">
                                  <Button slot="close" variant="flat" className="rounded-xl font-medium cursor-pointer">Cancel</Button>
                                  <Button slot="close" className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition-colors cursor-pointer" onPress={() => handleDeleteProduct(product._id)}>
                                    Yes, Delete
                                  </Button>
                                </AlertDialog.Footer>
                              </AlertDialog.Dialog>
                            </AlertDialog.Container>
                          </AlertDialog.Backdrop>
                        </AlertDialog>
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
