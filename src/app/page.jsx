"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Counter } from '@/components/Counter';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/api/products';
import { useSession } from '@/lib/auth-client';
import { getWishList } from '@/lib/api/wishlist';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const { data: session } = useSession();
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    // Fetch real products
    getProducts().then(products => {
      if (Array.isArray(products)) {
        // Sort by newest and take first 4
        const sorted = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFeaturedProducts(sorted.slice(0, 4));
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      getWishList(session.user.id).then(list => {
        if (Array.isArray(list)) {
          setWishList(list);
        }
      }).catch(err => console.error(err));
    }
  }, [session]);

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-gray-50 dark:bg-[#060e20] relative overflow-hidden">
      
      {/* ── Background Ambience ── */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      <div className="orb orb-emerald w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-30"></div>
      <div className="orb orb-lime w-[500px] h-[500px] top-[10%] right-[-100px] opacity-20"></div>
      <div className="orb orb-cyan w-[700px] h-[700px] bottom-[-200px] left-[20%] opacity-10"></div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO BANNER (Animated with Framer Motion)
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-24 pb-20 md:pt-32 md:pb-32 px-6">
        <div className="max-w-[1440px] mx-auto text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-8 backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            Premium Pre-owned Marketplace
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-[#e2e8f0] tracking-tight mb-8 leading-[1.1]"
          >
            Give Quality Tech <br className="hidden md:block" />
            a <span className="text-gradient">Second Life.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-600 dark:text-[#94a3b8] max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The most secure, sustainable platform to buy and sell premium pre-owned electronics, furniture, and more. 
            Verified sellers, guaranteed quality.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/products" className="w-full sm:w-auto">
              <button className="btn-primary w-full py-4 px-8 text-base shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-glow-pulse">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                Start Exploring
              </button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="btn-secondary w-full py-4 px-8 text-base bg-white/50 dark:bg-[#1a2340]/50 backdrop-blur-md">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                Become a Seller
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARKETPLACE STATISTICS (Animated Counters)
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-10 border-y border-gray-200 dark:border-[#475569]/10 bg-white/50 dark:bg-[#0d1527]/40 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200 dark:divide-white/10">
          
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-bold text-emerald-500 dark:text-emerald-400 mb-2">
              <Counter value={14250} suffix="+" />
            </div>
            <div className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] uppercase tracking-wider">Total Products</div>
          </div>
          
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-bold text-lime-500 dark:text-lime-400 mb-2">
              <Counter value={5200} suffix="+" />
            </div>
            <div className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] uppercase tracking-wider">Registered Sellers</div>
          </div>
          
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-bold text-cyan-500 dark:text-cyan-400 mb-2">
              <Counter value={89400} suffix="+" />
            </div>
            <div className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] uppercase tracking-wider">Total Buyers</div>
          </div>
          
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-bold text-emerald-500 dark:text-emerald-400 mb-2">
              <Counter value={125000} suffix="+" />
            </div>
            <div className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] uppercase tracking-wider">Completed Orders</div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: FEATURED PRODUCTS
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-2">Featured Products</h2>
              <p className="text-gray-600 dark:text-[#94a3b8]">Recently published premium items from verified sellers.</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-500 transition-colors">
              Explore All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product._id || index} product={product} index={index} user={session?.user} wishList={wishList} />
            ))}
            {featuredProducts.length === 0 && (
              // Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card h-80 rounded-2xl animate-pulse bg-gray-200 dark:bg-white/5"></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: POPULAR CATEGORIES
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 bg-white dark:bg-transparent border-y border-gray-200 dark:border-transparent">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-2">Popular Categories</h2>
              <p className="text-gray-600 dark:text-[#94a3b8]">Find exactly what you're looking for.</p>
            </div>
            <Link href="/categories" className="hidden md:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-500 transition-colors">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link href="/products?category=Electronics" className="glass-card glass-card-hover rounded-3xl p-6 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0d1527] border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors z-10">
                <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-[#e2e8f0] group-hover:text-emerald-500 dark:group-hover:text-emerald-400">laptop_mac</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">Electronics</h3>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8]">Laptops, PCs, Audio</p>
              </div>
            </Link>

            <Link href="/products?category=Mobile+Phones" className="glass-card glass-card-hover rounded-3xl p-6 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl group-hover:bg-lime-500/20 transition-all"></div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0d1527] border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:border-lime-500/50 transition-colors z-10">
                <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-[#e2e8f0] group-hover:text-lime-500 dark:group-hover:text-lime-400">smartphone</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1 group-hover:text-lime-500 dark:group-hover:text-lime-400 transition-colors">Mobile Phones</h3>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8]">iPhones, Androids</p>
              </div>
            </Link>

            <Link href="/products?category=Furniture" className="glass-card glass-card-hover rounded-3xl p-6 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0d1527] border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:border-amber-500/50 transition-colors z-10">
                <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-[#e2e8f0] group-hover:text-amber-500 dark:group-hover:text-amber-400">chair</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">Furniture</h3>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8]">Chairs, Tables, Sofas</p>
              </div>
            </Link>

            <Link href="/products?category=Fashion" className="glass-card glass-card-hover rounded-3xl p-6 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0d1527] border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:border-pink-500/50 transition-colors z-10">
                <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-[#e2e8f0] group-hover:text-pink-500 dark:group-hover:text-pink-400">checkroom</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">Fashion</h3>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8]">Clothes, Shoes, Bags</p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          EXTRA SECTION 1: SUSTAINABILITY IMPACT
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 bg-emerald-900/10 border-y border-emerald-500/20">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6">
              <span className="material-symbols-outlined text-[18px]">eco</span>
              Sustainability Impact
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">
              Empowering the <span className="text-emerald-500 dark:text-emerald-400">Circular Economy.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-[#94a3b8] mb-8 leading-relaxed">
              Every item sold on EverTrade is one less item in a landfill. By choosing pre-owned, you are actively reducing global electronic waste, minimizing carbon emissions, and promoting sustainable consumption worldwide.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-white/50 dark:bg-transparent">
                <span className="material-symbols-outlined text-4xl text-emerald-500 dark:text-emerald-400 mb-4 block">recycling</span>
                <h4 className="text-gray-900 dark:text-white font-bold text-xl mb-1">E-Waste Avoided</h4>
                <p className="text-gray-600 dark:text-[#94a3b8]">Over 12,000 devices given a second life.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-lime-500/20 bg-white/50 dark:bg-transparent">
                <span className="material-symbols-outlined text-4xl text-lime-500 dark:text-lime-400 mb-4 block">compost</span>
                <h4 className="text-gray-900 dark:text-white font-bold text-xl mb-1">Carbon Offset</h4>
                <p className="text-gray-600 dark:text-[#94a3b8]">Equivalent to planting 4,500 trees.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px] rounded-3xl overflow-hidden glass-card border border-emerald-500/30"
          >
            <Image 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80" 
              alt="Sustainability Nature"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          EXTRA SECTION 2: TRUSTED SELLERS SHOWCASE
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-[1440px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Trusted Sellers Showcase
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">
            Buy with Absolute Confidence
          </h2>
          <p className="text-gray-600 dark:text-[#94a3b8] max-w-2xl mx-auto mb-16">
            Our top-rated merchants have proven track records of quality products, fast shipping, and excellent communication.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10 flex flex-col items-center group bg-white/50 dark:bg-transparent"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-emerald-500">
                  <Image src={`https://i.pravatar.cc/150?img=${i * 10 + 5}`} alt="Seller" fill className="object-cover" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-2 border-[#060e20] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[12px]">check</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Seller {["Sarah", "Alex", "David", "Emma"][i-1]}</h3>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className="material-symbols-outlined text-[16px]">star</span>
                  ))}
                  <span className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] ml-1">5.0</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8] text-center mb-6 line-clamp-2">
                  "Specializes in mint-condition electronics and professional gear."
                </p>
                <button className="btn-secondary w-full py-2 text-sm">View Store</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: SUCCESS STORIES
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 bg-white dark:bg-[#0d1527]/40 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">Success Stories</h2>
            <p className="text-gray-600 dark:text-[#94a3b8]">Hear from our community of buyers and sellers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10 relative">
              <span className="material-symbols-outlined text-6xl text-emerald-500/20 absolute top-6 right-6">format_quote</span>
              <div className="flex items-center gap-4 mb-6">
                <Image src="https://i.pravatar.cc/150?img=1" alt="User" width={50} height={50} className="rounded-full" />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold">Rakib Hasan</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Verified Buyer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-[#94a3b8] italic">
                "Bought a used MacBook Pro for my freelancing work. It arrived in exactly the condition described. Saved over 40k BDT. Highly recommended platform!"
              </p>
            </div>
            <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10 relative">
              <span className="material-symbols-outlined text-6xl text-lime-500/20 absolute top-6 right-6">format_quote</span>
              <div className="flex items-center gap-4 mb-6">
                <Image src="https://i.pravatar.cc/150?img=5" alt="User" width={50} height={50} className="rounded-full" />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold">Nusrat Jahan</h4>
                  <p className="text-sm text-lime-600 dark:text-lime-400">Top Rated Seller</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-[#94a3b8] italic">
                "Sold my old furniture when moving out. The process was incredibly smooth, and the secure payment system gave me peace of mind."
              </p>
            </div>
            <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10 relative">
              <span className="material-symbols-outlined text-6xl text-cyan-500/20 absolute top-6 right-6">format_quote</span>
              <div className="flex items-center gap-4 mb-6">
                <Image src="https://i.pravatar.cc/150?img=8" alt="User" width={50} height={50} className="rounded-full" />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold">Arafat Rahman</h4>
                  <p className="text-sm text-cyan-600 dark:text-cyan-400">Verified Buyer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-[#94a3b8] italic">
                "I was skeptical about buying a used DSLR, but the seller verification badge helped me trust the merchant. The camera is flawless."
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
