import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-container border-t border-outline/10 py-12 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Meta Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
            <span className="text-lg font-bold tracking-tight text-on-surface">
              Ever<span className="text-secondary">Trade</span>
            </span>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            The premium circular economy platform for buying and selling high-quality pre-owned items.
          </p>
        </div>

        {/* Quick Links (Job Seekers / Buyers) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Marketplace</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>
              <Link href="/products" className="hover:text-secondary transition-colors">
                Browse Products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-secondary transition-colors">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-secondary transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links (Employers / Sellers) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Community</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>
              <Link href="/sustainability" className="hover:text-secondary transition-colors">
                Sustainability Impact
              </Link>
            </li>
            <li>
              <Link href="/sellers" className="hover:text-secondary transition-colors">
                Trusted Merchants
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-secondary transition-colors">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info & Socials */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>
              <Link href="/about" className="hover:text-secondary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-secondary transition-colors">
                Contact Inquiries
              </Link>
            </li>
            <li className="flex items-center gap-3 pt-2">
              <span className="material-symbols-outlined text-lg text-on-surface-variant hover:text-secondary cursor-pointer">
                mail
              </span>
              <span className="material-symbols-outlined text-lg text-on-surface-variant hover:text-secondary cursor-pointer">
                call
              </span>
              <span className="material-symbols-outlined text-lg text-on-surface-variant hover:text-secondary cursor-pointer">
                public
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-8 pt-6 border-t border-outline/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
        <span>&copy; {new Date().getFullYear()} EverTrade. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-secondary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-secondary transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
