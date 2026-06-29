"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertDialog, Button } from "@heroui/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleModerate = async (productId, status) => {
    try {
      await fetch(`${API_URL}/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moderationStatus: status })
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to moderate product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`${API_URL}/products/${productId}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.sellerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-outfit">Manage Products</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Review, approve, and remove seller listings.</p>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm">
                  <th className="pb-4 font-medium px-4">Product</th>
                  <th className="pb-4 font-medium px-4">Seller</th>
                  <th className="pb-4 font-medium px-4">Price</th>
                  <th className="pb-4 font-medium px-4">Moderation</th>
                  <th className="pb-4 font-medium px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="text-gray-800 dark:text-gray-300 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-black/50">
                          {product.images && (
                            <Image 
                              src={typeof product.images === 'string' ? product.images : (product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80')} 
                              alt={product.title} 
                              fill 
                              className="object-cover" 
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white max-w-[150px] truncate" title={product.title}>{product.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{product.sellerName || 'Unknown'}</td>
                    <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-bold">${product.price?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        product.moderationStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        product.moderationStatus === 'rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {product.moderationStatus || 'Pending'}
                      </span>
                      {product.isReported && (
                        <span className="ml-2 px-2 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white">
                          REPORTED
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {product.moderationStatus !== 'approved' && (
                          <button 
                            onClick={() => handleModerate(product._id, 'approved')}
                            className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {product.moderationStatus !== 'rejected' && (
                          <button 
                            onClick={() => handleModerate(product._id, 'rejected')}
                            className="px-3 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-lg text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                        )}
                        
                        <AlertDialog>
                          <Button variant="danger" size="sm">Delete</Button>
                          <AlertDialog.Backdrop>
                            <AlertDialog.Container>
                              <AlertDialog.Dialog className="sm:max-w-[400px]">
                                <AlertDialog.CloseTrigger />
                                <AlertDialog.Header>
                                  <AlertDialog.Icon status="danger" />
                                  <AlertDialog.Heading>Delete Listing?</AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body>
                                  <p>
                                    This will permanently remove <strong>{product.title}</strong> from the platform.
                                  </p>
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                  <Button slot="close" variant="tertiary">Cancel</Button>
                                  <Button slot="close" variant="danger" onPress={() => handleDeleteProduct(product._id)}>
                                    Yes, Delete
                                  </Button>
                                </AlertDialog.Footer>
                              </AlertDialog.Dialog>
                            </AlertDialog.Container>
                          </AlertDialog.Backdrop>
                        </AlertDialog>
                      </div>
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
