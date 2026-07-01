"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistClient({ wishList = [], user }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">My Wishlist</h1>
        <p className="text-zinc-500 font-medium mt-2 text-lg">Saved items you are keeping an eye on.</p>
      </div>

      <div className="pt-4">
        {wishList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 font-medium mb-6">Your wishlist is empty.</p>
            <Link href="/products">
              <button className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold rounded-xl transition-colors">
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
