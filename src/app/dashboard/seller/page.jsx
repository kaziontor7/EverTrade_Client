"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { mockApi } from "@/services/mockApi";
import Image from "next/image";

export default function SellerDashboard() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: "", price: "", category: "Electronics", condition: "Like New" });
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", price: "", category: "", condition: "" });

  useEffect(() => {
    const fetchListings = async () => {
      if (session?.user?.id) {
        try {
          // In mock mode, we just fetch all or filter mockProducts
          const myProducts = await mockApi.getProductsBySeller("user_123"); // Mock ID for demonstration
          setProducts(myProducts);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchListings();
  }, [session]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const added = await mockApi.createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        sellerId: session?.user?.id || "user_123",
        sellerName: session?.user?.name || "Seller",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"] // Mock image
      });
      setProducts([added, ...products]);
      setIsAdding(false);
      setNewProduct({ title: "", price: "", category: "Electronics", condition: "Like New" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await mockApi.deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditData({ 
      title: product.title, 
      price: product.price, 
      category: product.category, 
      condition: product.condition 
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const updated = await mockApi.updateProduct(editingId, {
        ...editData,
        price: Number(editData.price)
      });
      setProducts(products.map(p => p._id === editingId ? updated : p));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">
            Seller Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your listings and view your sales.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-gray-900 dark:text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          {isAdding ? "Cancel" : "Add New Listing"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Listing</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-400">Product Title</label>
              <input 
                required
                type="text" 
                value={newProduct.title}
                onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g., iPhone 13 Pro"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-400">Price ($)</label>
              <input 
                required
                type="number" 
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g., 500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-400">Category</label>
              <select 
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Furniture</option>
                <option>Automotive</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-400">Condition</label>
              <select 
                value={newProduct.condition}
                onChange={e => setNewProduct({...newProduct, condition: e.target.value})}
                className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="w-full py-3 bg-emerald-500 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Active Listings</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">You don't have any active listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-gray-100/60 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors group">
                <div className="h-48 w-full relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <Image 
                    src={product.images[0]} 
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md text-emerald-400 font-bold rounded-full text-sm border border-emerald-500/20">
                    ${product.price}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{product.category}</span>
                    <span>{product.condition}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-900 dark:text-white rounded-xl text-sm font-medium transition-colors border border-gray-200 dark:border-white/5"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors border border-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative">
            <button 
              onClick={() => setEditingId(null)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit Listing</h2>
            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-600 dark:text-gray-400">Product Title</label>
                <input 
                  required
                  type="text" 
                  value={editData.title}
                  onChange={e => setEditData({...editData, title: e.target.value})}
                  className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600 dark:text-gray-400">Price ($)</label>
                <input 
                  required
                  type="number" 
                  value={editData.price}
                  onChange={e => setEditData({...editData, price: e.target.value})}
                  className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600 dark:text-gray-400">Category</label>
                <select 
                  value={editData.category}
                  onChange={e => setEditData({...editData, category: e.target.value})}
                  className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Furniture</option>
                  <option>Automotive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600 dark:text-gray-400">Condition</label>
                <select 
                  value={editData.condition}
                  onChange={e => setEditData({...editData, condition: e.target.value})}
                  className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
              <div className="md:col-span-2 pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="flex-1 py-3 bg-white/5 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
