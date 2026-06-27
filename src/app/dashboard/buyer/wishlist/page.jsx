"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockApi } from "@/services/mockApi";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Mocking wishlist by just grabbing the first two products
        const allProducts = await mockApi.getProducts();
        setWishlist(allProducts.slice(0, 2));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter(p => p._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white font-outfit">My Wishlist</h1>
        <p className="text-gray-400 mt-2">Saved items you are keeping an eye on.</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Your wishlist is empty.</p>
            <Link href="/products">
              <button className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors">
                Browse Marketplace
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map(product => (
              <div key={product._id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors group h-full flex flex-col">
                <div className="h-48 w-full relative overflow-hidden bg-gray-800">
                  <Image 
                    src={product.images[0]} 
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md text-emerald-400 font-bold rounded-full text-sm border border-emerald-500/20">
                    ${product.price}
                  </div>
                  <button 
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 left-3 w-8 h-8 bg-black/60 backdrop-blur-md text-red-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.title}</h3>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-4 border-t border-white/10">
                    <span>{product.category}</span>
                    <span className="bg-white/5 px-2 py-1 rounded-md">{product.condition}</span>
                  </div>
                  <Link href={`/products/${product._id}`} className="mt-4 w-full block text-center py-2 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-white rounded-xl text-sm font-medium transition-colors border border-white/5 hover:border-emerald-500/30">
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
