"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistClient({ wishList = [], user }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">My Wishlist</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Saved items you are keeping an eye on.</p>
      </div>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6">
        {wishList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Your wishlist is empty.</p>
            <Link href="/products">
              <button className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors">
                Browse Marketplace
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {wishList.map(item => {
              // Transform the wishlist item back into the standard product format
              // so we can reuse the beautiful ProductCard component seamlessly
              const product = {
                _id: item.productId,
                title: item.productName,
                price: item.productPrice,
                images: item.productImage,
                category: item.category,
                condition: item.condition,
                location: item.location,
              };

              return (
                <ProductCard 
                  key={item._id} 
                  product={product} 
                  user={user} 
                  wishList={wishList} 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
