"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ProductCard } from '@/components/ProductCard';

export default function HomeClient({ initialFeaturedProducts = [], initialWishList = [], user }) {
  const featuredProducts = initialFeaturedProducts;
  const wishList = initialWishList;

  const categories = [
    { name: "Electronics", icon: "laptop_mac", desc: "Laptops, Desktops & Components" },
    { name: "Mobile Phones", icon: "smartphone", desc: "Smartphones & Accessories" },
    { name: "Furniture", icon: "chair", desc: "Desks, Chairs & Setup Gear" },
    { name: "Fashion", icon: "checkroom", desc: "Tech Apparel & Bags" },
    { name: "Automotive", icon: "directions_car", desc: "EV Accessories & Tech" },
    { name: "Books", icon: "menu_book", desc: "Programming & Tech Books" }
  ];

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-[var(--bg-color)] relative overflow-hidden font-inter">
      
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO (Pure Minimalist Typography)
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-32 pb-24 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center text-center min-h-[70vh]">

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black text-zinc-900 dark:text-white tracking-tighter mb-6 leading-[0.95]">
            Don't buy new.
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            The verified marketplace for premium pre-owned goods.
          </p>

          <div className="w-full max-w-2xl mx-auto">
            <form action="/products" className="relative group flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)] to-purple-500 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative flex w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 text-2xl z-10 pointer-events-none">search</span>
                <input 
                  type="text" 
                  name="search"
                  placeholder="Search for MacBook Pro, PS5, Herman Miller..." 
                  className="w-full h-16 md:h-20 pl-16 pr-32 bg-transparent text-lg md:text-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                  autoComplete="off"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button type="submit" className="h-12 md:h-16 px-6 md:px-8 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-[var(--text-muted)]">
              <span>Popular:</span>
              <Link href="/products?category=Electronics" className="hover:text-[var(--text-primary)] transition-colors">MacBooks</Link>
              <Link href="/products?category=Mobile%20Phones" className="hover:text-[var(--text-primary)] transition-colors">iPhones</Link>
              <Link href="/products?category=Furniture" className="hover:text-[var(--text-primary)] transition-colors">Herman Miller</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: POPULAR CATEGORIES (Bento Grid)
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 md:py-32 px-6 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800/50">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-3 tracking-tight">Browse by category.</h2>
            </div>
            <Link href="/products" className="group hidden md:flex items-center gap-2 text-[var(--text-primary)] font-semibold hover:text-[var(--accent-color)] transition-all">
              View All Categories <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          {/* Bento Grid Layout for Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link key={idx} href={`/products?category=${encodeURIComponent(cat.name)}`} className="block">
                <div className="premium-card h-48 p-8 flex flex-col justify-between group bg-[var(--surface-color)] relative overflow-hidden">
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-dim-color)] text-[var(--text-primary)] flex items-center justify-center border border-[var(--border-color)] group-hover:scale-110 group-hover:bg-[var(--accent-color)] group-hover:text-white transition-all duration-300">
                      <span className="material-symbols-outlined font-bold">{cat.icon}</span>
                    </div>
                    <span className="material-symbols-outlined text-[var(--text-muted)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">arrow_forward</span>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{cat.name}</h3>
                    <p className="text-sm font-medium text-[var(--text-muted)]">{cat.desc}</p>
                  </div>

                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: FEATURED PRODUCTS
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 md:py-32 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-3 tracking-tight">Just listed.</h2>
            </div>
            <Link href="/products" className="group hidden md:flex items-center gap-2 text-[var(--text-primary)] font-semibold hover:text-[var(--accent-color)] transition-all">
              Shop All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                index={index} 
                user={user} 
                wishList={wishList}
              />
            ))}
            {featuredProducts.length === 0 && (
              // Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="premium-card h-80 animate-pulse bg-[var(--surface-color)]"></div>
              ))
            )}
          </div>
          
          <div className="mt-12 md:hidden flex justify-center">
            <Link href="/products" className="btn-primary w-full">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: TRUST & SAFETY
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 md:py-32 px-6 bg-zinc-950 dark:bg-black text-white border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 mx-auto md:mx-0 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <span className="material-symbols-outlined font-bold">verified_user</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Verified Sellers.</h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Look for the blue badge. Shop confidently from our vetted merchants.
            </p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 mx-auto md:mx-0 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <span className="material-symbols-outlined font-bold">lock</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Stripe Secured.</h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Funds are held until your item arrives exactly as described.
            </p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 mx-auto md:mx-0 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <span className="material-symbols-outlined font-bold">eco</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Zero E-Waste.</h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Buy pre-owned. Keep good items out of landfills.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
