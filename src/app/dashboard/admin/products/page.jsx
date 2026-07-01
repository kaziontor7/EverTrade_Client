"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertDialog, Button, toast } from "@heroui/react";
import { moderateProduct, deleteProduct } from "@/lib/api/admin";
import { getProducts } from "@/lib/api/products";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      if (data && data.products && Array.isArray(data.products)) {
        setProducts(data.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else if (data && Array.isArray(data)) {
        setProducts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.danger("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleModerate = async (productId, status) => {
    try {
      await moderateProduct(productId, status);
      toast.success(`Product ${status} successfully.`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to moderate product:", error);
      toast.danger("Failed to update product status.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.danger("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.sellerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Manage Products</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Review, approve, and remove seller listings.</p>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:zinc-100/50 text-zinc-900 dark:text-white transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                  <th className="pb-4 font-medium px-4">Product</th>
                  <th className="pb-4 font-medium px-4">Seller</th>
                  <th className="pb-4 font-medium px-4">Price</th>
                  <th className="pb-4 font-medium px-4">Moderation</th>
                  <th className="pb-4 font-medium px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-zinc-100 dark:bg-black/50">
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
                          <p className="font-medium text-zinc-900 dark:text-white max-w-[150px] truncate" title={product.title}>{product.title}</p>
                          <p className="text-xs text-zinc-500 capitalize">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{product.sellerName || 'Unknown'}</td>
                    <td className="py-4 px-4 text-zinc-600 dark:text-zinc-400 font-bold">${product.price?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                        product.moderationStatus === 'approved' ? 'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700' :
                        product.moderationStatus === 'rejected' ? 'bg-transparent text-zinc-400 border-zinc-200 border-dashed dark:border-zinc-800 line-through' :
                        'bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800'
                      }`}>
                        {product.moderationStatus || 'Pending'}
                      </span>
                      {product.reported && (
                        <span className="ml-2 px-2 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                          REPORTED
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {product.moderationStatus !== 'approved' && (
                          <button 
                            onClick={() => handleModerate(product._id, 'approved')}
                            className="cursor-pointer px-3 min-w-0 h-8 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs rounded transition-colors uppercase tracking-wider"
                          >
                            Approve
                          </button>
                        )}
                        {product.moderationStatus !== 'rejected' && (
                          <button 
                            onClick={() => handleModerate(product._id, 'rejected')}
                            className="cursor-pointer px-3 min-w-0 h-8 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white font-bold text-xs rounded transition-colors uppercase tracking-wider"
                          >
                            Reject
                          </button>
                        )}
                        
                        <AlertDialog>
                          <Button className="cursor-pointer px-3 min-w-0 h-8 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded transition-colors uppercase tracking-wider shadow-sm">
                            Delete
                          </Button>
                          <AlertDialog.Backdrop>
                            <AlertDialog.Container>
                              <AlertDialog.Dialog className="rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-xl bg-white dark:bg-zinc-900 max-w-[400px]">
                                <AlertDialog.CloseTrigger />
                                <AlertDialog.Header className="border-b border-zinc-200 dark:border-zinc-800/50 pb-4 pt-6">
                                  <AlertDialog.Heading className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Delete Listing?</AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body className="py-6">
                                  <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                                    This will permanently remove <strong className="text-zinc-900 dark:text-white">"{product.title}"</strong> from the platform.
                                  </p>
                                </AlertDialog.Body>
                                <AlertDialog.Footer className="border-t border-zinc-200 dark:border-zinc-800/50 pt-4 pb-6">
                                  <Button slot="close" variant="flat" className="rounded-xl font-medium">Cancel</Button>
                                  <Button slot="close" className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition-colors" onPress={() => handleDeleteProduct(product._id)}>
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
