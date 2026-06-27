import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gray-100 dark:bg-[#131b2e] mt-auto overflow-hidden border-t border-gray-200 dark:border-[#475569]/10 pt-16 pb-8">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-lime-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter (Takes up 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <span className="material-symbols-outlined text-emerald-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  eco
                </span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#e2e8f0]">
                Ever<span className="text-emerald-400">Trade</span>
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-[#94a3b8] leading-relaxed max-w-sm">
              The premium circular economy platform. Buy and sell high-quality pre-owned items while contributing to a sustainable future.
            </p>

            {/* Newsletter Input */}
            <div className="pt-4 max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-[#94a3b8] mb-3">Join our newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="et-input flex-grow text-sm py-3"
                />
                <button className="w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Links: Marketplace */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-900 dark:text-[#e2e8f0] uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/products" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[16px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">chevron_right</span>
                  Browse Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[16px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">chevron_right</span>
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[16px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">chevron_right</span>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Community */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-900 dark:text-[#e2e8f0] uppercase tracking-wider">Community</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/sustainability" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[16px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">chevron_right</span>
                  Sustainability Impact
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[16px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">chevron_right</span>
                  Trusted Sellers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[16px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">chevron_right</span>
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Company & Socials */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-900 dark:text-[#e2e8f0] uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[16px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">chevron_right</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[16px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">chevron_right</span>
                  Contact
                </Link>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1a2340] border border-gray-200 dark:border-[#475569]/10 flex items-center justify-center text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300">
                <span className="material-symbols-outlined text-lg">mail</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1a2340] border border-gray-200 dark:border-[#475569]/10 flex items-center justify-center text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300">
                <span className="material-symbols-outlined text-lg">call</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1a2340] border border-gray-200 dark:border-[#475569]/10 flex items-center justify-center text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-[#475569]/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 dark:text-[#94a3b8]">
            &copy; {new Date().getFullYear()} EverTrade. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium">
            <Link href="/privacy" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
