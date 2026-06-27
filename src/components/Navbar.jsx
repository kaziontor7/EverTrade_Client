"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '../lib/auth-client';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch the active session from Better Auth
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
          setIsMobileMenuOpen(false);
        },
      },
    });
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
  ];

  const dashboardLinks = {
    buyer: '/dashboard/buyer',
    seller: '/dashboard/seller',
    admin: '/dashboard/admin',
  };

  // Add Dashboard link if logged in
  if (session?.user?.role) {
    navLinks.push({
      name: 'Dashboard',
      href: dashboardLinks[session.user.role] || '/dashboard/buyer',
    });
  }

  return (
    <header className="sticky top-0 left-0 w-full z-50">
      <div className="bg-white/80 dark:bg-[#0d1527]/80 backdrop-blur-xl border-b border-gray-200 dark:border-[#475569]/10">
        <nav className="max-w-[1440px] mx-auto flex justify-between items-center px-6 md:px-12 h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-10">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
                  <span className="material-symbols-outlined text-emerald-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    eco
                  </span>
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#e2e8f0] group-hover:text-emerald-400 transition-colors">
                  Ever<span className="text-emerald-400">Trade</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8 mt-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`nav-link font-medium text-sm transition-colors py-1 ${
                      isActive
                        ? 'text-emerald-400 nav-link-active'
                        : 'text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section (Auth / Call-To-Action) */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            {isPending ? (
              <div className="w-24 h-9 bg-gray-200 dark:bg-[#1a2340] animate-pulse rounded-xl"></div>
            ) : session ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <span className="text-xs font-bold text-emerald-400">{session.user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-[#e2e8f0]">
                    {session.user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  className="text-sm font-medium text-gray-600 dark:text-[#94a3b8] hover:text-error transition-colors flex items-center gap-1"
                  onClick={handleSignOut}
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/signin" className="text-sm font-medium text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
                <Link href="/signup">
                  <button className="btn-primary py-2 px-5 text-sm animate-glow-pulse">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#1a2340] flex items-center justify-center text-gray-900 dark:text-[#e2e8f0] hover:text-emerald-400 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Decorative Gradient Line */}
      <div className="gradient-line w-full"></div>

      {/* Mobile Dropdown Menu (Glassmorphic) */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 top-[82px] bg-gray-50 dark:bg-[#060e20]/80 backdrop-blur-md z-40 md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-[82px] left-0 w-full bg-white dark:bg-[#0d1527] border-b border-gray-200 dark:border-[#475569]/10 flex flex-col p-6 gap-6 md:hidden z-50 shadow-2xl animate-slide-down">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-lg font-medium transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-gray-600 dark:text-[#94a3b8] hover:text-emerald-400'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="w-full h-px bg-gray-200 dark:bg-[#475569]/10"></div>

            <div className="flex flex-col gap-4">
              {isPending ? (
                <div className="w-full h-12 bg-gray-200 dark:bg-[#1a2340] animate-pulse rounded-xl"></div>
              ) : session ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <span className="text-sm font-bold text-emerald-400">{session.user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-lg font-medium text-gray-900 dark:text-[#e2e8f0]">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    className="btn-secondary w-full py-3 flex justify-center border-error/50 text-error hover:bg-error/10 hover:border-error"
                    onClick={handleSignOut}
                  >
                    <span className="material-symbols-outlined mr-2">logout</span>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="btn-secondary w-full py-3 justify-center text-gray-900 dark:text-[#e2e8f0]">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="btn-primary w-full py-3 justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
