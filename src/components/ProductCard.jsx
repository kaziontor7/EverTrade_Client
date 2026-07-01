"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { createWish, deleteWish } from "@/lib/actions/wishlist";
import { toast } from "@heroui/react";
import { revalidate } from "@/lib/core/server";

export function ProductCard({ product, index = 0, user, wishList }) {
  const router = useRouter();
  const checkExist = wishList?.find(item => item.productId === product._id);

  const onClickHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.danger("Please login to add to wishlist");
      return;
    }

    if (user.role === 'seller' || user.role === 'admin') {
      toast.danger("Sellers and Admins cannot add products to wishlist");
      return;
    }

    if (checkExist) {
      const deleteWishList = await deleteWish(checkExist._id);
      if (deleteWishList.acknowledged) {
        toast("Product removed from wishlist");
        await revalidate('/');
        await revalidate('/products');
        await revalidate('/dashboard/buyer/wishlist');
      } else {
        toast.danger("Failed to remove product from wishlist");
      }
      return;
    }

    const wishlistData = {
      productId: product._id,
      userId: user?.id,
      productName: product.title,
      productPrice: product.price,
      productImage: product.images,
      category: product.category,
      condition: product.condition,
      location: product.location,
    }

    const res = await createWish(wishlistData);

    if (res.acknowledged) {
      toast.success("Product added to wishlist");
      await revalidate('/');
      await revalidate('/products');
      await revalidate('/dashboard/buyer/wishlist');
    } else {
      toast.danger("Failed to add product to wishlist");
    }
  }

  return (
    <div
      className="premium-card overflow-hidden flex flex-col h-full group cursor-pointer"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      <div className="block flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800/50 overflow-hidden border-b border-[var(--border-color)]">
          <Image
            src={typeof product.images === 'string' ? product.images : (product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80')}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Top Badges */}
          <div className="absolute top-3 right-3 flex justify-end items-start">
            <button
              className="w-8 h-8 rounded bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors border border-gray-200 dark:border-zinc-700"
              onClick={onClickHandler}
            >
              <Heart className={`w-4 h-4 transition-colors ${checkExist ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white"}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col bg-[var(--surface-color)]">
          <div className="flex justify-between items-start mb-1 gap-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-[var(--accent-color)] transition-colors">
              {product.title}
            </h3>
            <span className="text-lg font-black text-zinc-900 dark:text-white shrink-0">
              ${product.price.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center text-sm font-medium text-[var(--text-secondary)] mb-3 gap-2">
            <span className="capitalize">{product.category}</span>
            <span className="opacity-50">&bull;</span>
            <span className="capitalize">{product.condition}</span>
          </div>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[14px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">{product.averageRating.toFixed(1)}</span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">({product.reviewCount})</span>
            </div>
          )}

          <div className="mt-auto pt-3 flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span className="truncate max-w-[80px]">{product.location || 'Dhaka'}</span>
              {product.sellerVerified && (
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white ml-1 shadow-sm" title="Verified Seller">
                  <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[var(--text-primary)] font-bold group-hover:text-[var(--accent-color)] transition-colors">
              <span>View</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
