"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { createWish, deleteWish } from "@/lib/actions/wishlist";

import { toast } from "@heroui/react";
import { useState } from "react";
import { revalidate } from "@/lib/core/server";


export function ProductCard({ product, index = 0, user, wishList }) {
  // We use `motion.div` to fulfill the assignment requirement:
  // "Framer Motion... applied smoothly to... all interactive Product Cards"

  const checkExist = wishList?.find(item => item.productId === product._id);



  const onClickHandler = async () => {

    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    if (checkExist) {
      const deleteWishList = await deleteWish(checkExist._id);
      if (deleteWishList.acknowledged) {
        toast.info("Product removed from wishlist");
        await revalidate('/products');
        await revalidate('/dashboard/buyer/wishlist');
      }
      else {
        toast.error("Failed to remove product from wishlist");
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
      await revalidate("/products");
      await revalidate('/dashboard/buyer/wishlist');
    } else {
      toast.error("Failed to add product to wishlist");
    }

  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col h-full group"
    >
      <div className="block flex-1 flex flex-col">
        {/* Image Container with strict aspect ratio */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <Image
            src={typeof product.images === 'string' ? product.images : (product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80')}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {product.condition}
            </span>
            <button
              className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/40 dark:hover:bg-black/60 transition-colors border border-white/20"
              onClick={onClickHandler}
            >
              <Heart className={`w-5 h-5 transition-colors ${checkExist ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col bg-white/50 dark:bg-transparent">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0] mb-2 line-clamp-2 leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            {product.title}
          </h3>

          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm text-gray-600 dark:text-[#94a3b8]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span className="truncate max-w-[100px]">{product.location || 'Dhaka'}</span>
            </div>
            <Link href={`/products/${product._id}`} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer">
              <span>View Details</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
