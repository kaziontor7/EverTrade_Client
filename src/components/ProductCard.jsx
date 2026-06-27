"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function ProductCard({ product, index = 0 }) {
  // We use `motion.div` to fulfill the assignment requirement:
  // "Framer Motion... applied smoothly to... all interactive Product Cards"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col h-full group"
    >
      <Link href={`/products/${product._id}`} className="block flex-1 flex flex-col">
        {/* Image Container with strict aspect ratio */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <Image 
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'} 
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
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist logic could go here
              }}
            >
              <span className="material-symbols-outlined text-white text-[18px]">favorite</span>
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
              ৳{product.price.toLocaleString()}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0] mb-2 line-clamp-2 leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            {product.title}
          </h3>
          
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm text-gray-600 dark:text-[#94a3b8]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span className="truncate max-w-[100px]">Dhaka</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span>View Details</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
