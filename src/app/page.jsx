"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex-grow flex flex-col min-h-screen bg-gray-50 dark:bg-[#060e20] relative overflow-hidden">
      
      {/* ── Background Ambience ── */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      <div className="orb orb-emerald w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-30"></div>
      <div className="orb orb-lime w-[500px] h-[500px] top-[10%] right-[-100px] opacity-20"></div>
      <div className="orb orb-cyan w-[700px] h-[700px] bottom-[-200px] left-[20%] opacity-10"></div>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-24 pb-20 md:pt-32 md:pb-32 px-6">
        <div className="max-w-[1440px] mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-8 animate-slide-up stagger-1 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            Premium Pre-owned Marketplace
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-[#e2e8f0] tracking-tight mb-8 animate-slide-up stagger-2 leading-[1.1]">
            Give Quality Tech <br className="hidden md:block" />
            a <span className="text-gradient">Second Life.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-[#94a3b8] max-w-2xl mx-auto mb-12 animate-slide-up stagger-3 leading-relaxed">
            The most secure, sustainable platform to buy and sell premium pre-owned electronics, furniture, and more. 
            Verified sellers, guaranteed quality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-4">
            <Link href="/products" className="w-full sm:w-auto">
              <button className="btn-primary w-full py-4 px-8 text-base shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-glow-pulse">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                Start Exploring
              </button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="btn-secondary w-full py-4 px-8 text-base bg-gray-200 dark:bg-[#1a2340]/50 backdrop-blur-md">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                Become a Seller
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-10 border-y border-gray-200 dark:border-[#475569]/10 bg-white dark:bg-[#0d1527]/40 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-outline/10">
          
          <div className="text-center px-4 animate-scale-in stagger-2">
            <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">10k+</div>
            <div className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] uppercase tracking-wider">Active Listings</div>
          </div>
          
          <div className="text-center px-4 animate-scale-in stagger-3">
            <div className="text-3xl md:text-4xl font-bold text-lime-400 mb-2">50k+</div>
            <div className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] uppercase tracking-wider">Happy Users</div>
          </div>
          
          <div className="text-center px-4 animate-scale-in stagger-4">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">100%</div>
            <div className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] uppercase tracking-wider">Secure Payments</div>
          </div>
          
          <div className="text-center px-4 animate-scale-in stagger-5">
            <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">5k+</div>
            <div className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] uppercase tracking-wider">kg CO₂ Saved</div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORIES SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-2">Browse by Category</h2>
              <p className="text-gray-600 dark:text-[#94a3b8]">Find exactly what you're looking for.</p>
            </div>
            <Link href="/categories" className="hidden md:flex items-center gap-1 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Category Card 1 */}
            <Link href="/products?category=laptops" className="glass-card glass-card-hover rounded-3xl p-6 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0d1527] border border-gray-300 dark:border-[#475569]/20 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors z-10">
                <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-[#e2e8f0] group-hover:text-emerald-400">laptop_mac</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1 group-hover:text-emerald-400 transition-colors">Laptops</h3>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8]">MacBooks, Windows PCs</p>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link href="/products?category=phones" className="glass-card glass-card-hover rounded-3xl p-6 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl group-hover:bg-lime-500/20 transition-all"></div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0d1527] border border-gray-300 dark:border-[#475569]/20 flex items-center justify-center group-hover:border-lime-500/50 transition-colors z-10">
                <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-[#e2e8f0] group-hover:text-lime-400">smartphone</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1 group-hover:text-lime-400 transition-colors">Smartphones</h3>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8]">iPhones, Androids</p>
              </div>
            </Link>

            {/* Category Card 3 */}
            <Link href="/products?category=audio" className="glass-card glass-card-hover rounded-3xl p-6 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0d1527] border border-gray-300 dark:border-[#475569]/20 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors z-10">
                <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-[#e2e8f0] group-hover:text-cyan-400">headphones</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1 group-hover:text-cyan-400 transition-colors">Audio</h3>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8]">Headphones, Speakers</p>
              </div>
            </Link>

            {/* Category Card 4 */}
            <Link href="/products?category=accessories" className="glass-card glass-card-hover rounded-3xl p-6 group cursor-pointer h-48 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0d1527] border border-gray-300 dark:border-[#475569]/20 flex items-center justify-center group-hover:border-purple-500/50 transition-colors z-10">
                <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-[#e2e8f0] group-hover:text-purple-400">watch</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1 group-hover:text-purple-400 transition-colors">Wearables</h3>
                <p className="text-sm text-gray-600 dark:text-[#94a3b8]">Smartwatches, Fitness trackers</p>
              </div>
            </Link>

          </div>

          <Link href="/categories" className="md:hidden mt-8 flex justify-center items-center gap-1 text-emerald-400 font-semibold">
            View All Categories <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden glass-card border-emerald-500/30 p-10 md:p-16 text-center">
            {/* Background Glows for CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-emerald-500/20 to-lime-500/20 blur-[80px] pointer-events-none rounded-full"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">
                Ready to declutter and <span className="text-emerald-400">earn?</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-[#94a3b8] mb-10">
                Join thousands of sellers who are making money while keeping perfectly good items out of landfills.
              </p>
              <Link href="/signup">
                <button className="btn-primary py-4 px-10 text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform duration-300">
                  Start Selling Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
