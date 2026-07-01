import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-color)] mt-auto border-t border-[var(--border-color)] pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center transform -rotate-3 transition-transform group-hover:rotate-0">
                <span className="material-symbols-outlined text-[24px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_mall
                </span>
              </div>
              <span className="text-3xl font-black tracking-tight text-[var(--text-primary)] font-outfit">
                EverTrade
              </span>
            </div>
            
            <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed max-w-sm">
              The premium circular economy platform. Buy and sell high-quality pre-owned items with confidence.
            </p>

            {/* Newsletter Input */}
            <div className="pt-4 max-w-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">Join our newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow text-sm py-3 px-4 bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-[var(--border-hover)] focus:border-black dark:focus:border-white rounded-lg outline-none transition-colors"
                />
                <button className="w-12 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black border border-transparent hover:bg-zinc-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Links: Marketplace */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/products" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-all">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-all">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-all">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Community */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">Community</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/sustainability" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-all">
                  Sustainability Impact
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-all">
                  Trusted Sellers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-all">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Company & Socials */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/about" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-all">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-all">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-[var(--surface-dim-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-black dark:hover:border-white transition-all">
                <span className="material-symbols-outlined text-lg">mail</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[var(--surface-dim-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-black dark:hover:border-white transition-all">
                <span className="material-symbols-outlined text-lg">call</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[var(--surface-dim-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-black dark:hover:border-white transition-all">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-color)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} EverTrade. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-bold">
            <Link href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
