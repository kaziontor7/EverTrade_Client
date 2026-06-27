"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";
import Image from "next/image";

export default function AdminOverview() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allProducts, allUsers] = await Promise.all([
          mockApi.getProducts(),
          mockApi.getAllUsers()
        ]);
        setProducts(allProducts);
        setUsers(allUsers);
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white font-outfit">
          Admin Overview
        </h1>
        <p className="text-gray-400 mt-2">Monitor platform activity and moderate listings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <p className="text-3xl font-bold text-white">{users.length}</p>
          <p className="text-sm text-gray-400 mt-1">Total Users</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <p className="text-3xl font-bold text-white">{products.length}</p>
          <p className="text-sm text-gray-400 mt-1">Active Listings</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4 text-yellow-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{pendingSellers}</p>
          <p className="text-sm text-yellow-400 mt-1">Pending Verifications</p>
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Product Moderation</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No active products to moderate.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-4 font-medium">Product</th>
                  <th className="pb-4 font-medium">Category</th>
                  <th className="pb-4 font-medium">Seller</th>
                  <th className="pb-4 font-medium">Report Status</th>
                  <th className="pb-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product._id} className="text-gray-300 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative rounded-md overflow-hidden bg-black/50">
                          <Image src={product.images[0]} alt="" fill className="object-cover" />
                        </div>
                        <span className="font-medium text-white line-clamp-1">{product.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{product.category}</td>
                    <td className="py-4 text-sm text-emerald-400">{product.sellerName}</td>
                    <td className="py-4">
                      {product.isReported ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Reported
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Clean
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/20"
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
  );
}
