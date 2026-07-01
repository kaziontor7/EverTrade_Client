"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Dropdown, Label, Header, Separator, Input } from '@heroui/react';
import { authClient } from '../lib/auth-client';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, isLoaded } = useCart();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
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
    <header className="sticky top-0 left-0 w-full z-50 bg-[var(--bg-color)]/80 backdrop-blur-lg border-b border-[var(--border-color)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <nav className="flex justify-between items-center h-20 gap-4 lg:gap-8">
          
          {/* Brand Logo & Desktop Links */}
          <div className="flex items-center gap-8 xl:gap-12 shrink-0">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-color)] rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[20px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_mall
                  </span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-outfit">
                  EverTrade
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8 mt-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-semibold text-sm transition-colors py-1 border-b-2 ${
                      isActive
                        ? 'text-[var(--text-primary)] border-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Global Search Bar (Hidden on Homepage) */}
          {pathname !== '/' && (
            <div className="hidden md:flex flex-grow max-w-xl">
              <form onSubmit={handleSearch} className="w-full relative flex items-center">
                <span className="material-symbols-outlined text-[var(--text-muted)] text-[20px] absolute left-3 z-10 pointer-events-none">search</span>
                <Input
                  type="text"
                  placeholder="Search products, brands, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-[var(--border-hover)] focus:border-black dark:focus:border-white rounded-lg shadow-sm h-10 pl-10 pr-12 w-full text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors"
                />
                <div className="absolute right-2 hidden lg:flex items-center justify-center px-1.5 py-0.5 rounded border border-[var(--border-color)] bg-[var(--surface-dim-color)] text-[10px] font-bold text-[var(--text-muted)]">
                  ⌘K
                </div>
              </form>
            </div>
          )}

          {/* Right Section (Auth / Call-To-Action) */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link href="/cart" className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
              {isLoaded && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-bold flex items-center justify-center rounded border-2 border-[var(--bg-color)]">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <ThemeToggle />
            
            <div className="w-px h-6 bg-[var(--border-color)] mx-2"></div>
            
            {isPending ? (
              <div className="w-24 h-10 bg-[var(--surface-dim-color)] animate-pulse rounded-lg border border-[var(--border-color)]"></div>
            ) : session ? (
              <Dropdown placement="bottom-end">
                <Dropdown.Trigger>
                  <div className="flex items-center gap-2 outline-none cursor-pointer hover:bg-[var(--surface-dim-color)] py-1.5 px-3 rounded-lg border border-transparent hover:border-[var(--border-color)] transition-all">
                    <div className="w-7 h-7 rounded bg-zinc-900 dark:bg-white flex items-center justify-center overflow-hidden">
                      {session.user.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-white dark:text-black">{session.user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {session.user.name.split(' ')[0]}
                    </span>
                    <span className="material-symbols-outlined text-[var(--text-muted)] text-sm">expand_more</span>
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover className="bg-[var(--surface-color)] border border-[var(--border-color)] shadow-xl rounded-xl min-w-[220px]">
                  <Dropdown.Menu aria-label="Profile Actions" className="p-2 flex flex-col gap-1">
                    <Dropdown.Section>
                      <Header className="px-2 flex flex-col items-start text-sm pb-2 pt-1">
                        <p className="font-semibold text-[var(--text-primary)]">Signed in as</p>
                        <p className="text-[var(--text-muted)] truncate w-[180px]">{session.user.email}</p>
                      </Header>
                    </Dropdown.Section>
                    
                    <Separator className="bg-[var(--border-color)] h-px w-full my-1" />
                    
                    <Dropdown.Item 
                      textValue="Dashboard"
                      className="px-3 py-2 hover:bg-[var(--surface-dim-color)] rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
                      onPress={() => router.push(dashboardLinks[session.user.role] || '/dashboard/buyer')}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[var(--text-secondary)]">dashboard</span>
                      <Label className="cursor-pointer text-[var(--text-primary)] font-semibold">Dashboard</Label>
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      textValue="Settings"
                      className="px-3 py-2 hover:bg-[var(--surface-dim-color)] rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
                      onPress={() => router.push('/dashboard/settings')}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[var(--text-secondary)]">settings</span>
                      <Label className="cursor-pointer text-[var(--text-primary)] font-semibold">Settings</Label>
                    </Dropdown.Item>

                    <Separator className="bg-[var(--border-color)] h-px w-full my-1" />

                    <Dropdown.Item 
                      textValue="Log Out"
                      className="px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer flex items-center gap-3 transition-colors group"
                      onPress={handleSignOut}
                    >
                      <span className="material-symbols-outlined text-[18px] text-red-500">logout</span>
                      <Label className="cursor-pointer font-semibold text-red-600 dark:text-red-400">Log Out</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signin" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2">
                  Log in
                </Link>
                <Link href="/signup">
                  <button className="btn-primary">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Cart & Theme Toggle */}
          <div className="md:hidden flex items-center gap-3 shrink-0">
            <Link href="/cart" className="relative p-2 text-[var(--text-primary)]">
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
              {isLoaded && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-[var(--bg-color)]">
                  {cartCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-lg bg-[var(--surface-dim-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)]"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Search Bar (Only visible on mobile) */}
      <div className="md:hidden px-6 pb-4">
        <form onSubmit={handleSearch} className="w-full relative flex items-center">
          <span className="material-symbols-outlined text-[var(--text-muted)] text-[20px] absolute left-3 z-10 pointer-events-none">search</span>
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-[var(--border-hover)] focus:border-black dark:focus:border-white rounded-lg shadow-sm h-10 pl-10 pr-4 w-full text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors"
          />
        </form>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 top-[132px] bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-[132px] left-0 w-full bg-[var(--bg-color)] border-b border-[var(--border-color)] flex flex-col p-6 gap-6 md:hidden z-50 shadow-xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-lg font-semibold py-3 border-b border-[var(--border-color)] ${
                      isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {isPending ? (
                <div className="w-full h-12 bg-[var(--surface-dim-color)] animate-pulse rounded-lg border border-[var(--border-color)]"></div>
              ) : session ? (
                <>
                  <div className="flex items-center gap-3 mb-2 p-3 bg-[var(--surface-dim-color)] rounded-lg border border-[var(--border-color)]">
                    <div className="w-10 h-10 rounded bg-zinc-900 dark:bg-white flex items-center justify-center overflow-hidden">
                      {session.user.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-white dark:text-black">{session.user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-lg font-semibold text-[var(--text-primary)]">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    className="w-full py-3 flex justify-center items-center font-bold border border-red-200 bg-red-50 text-red-600 rounded-lg dark:bg-red-950/30 dark:border-red-900/50"
                    onClick={handleSignOut}
                  >
                    <span className="material-symbols-outlined mr-2">logout</span>
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-3 justify-center font-semibold text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--surface-dim-color)]">
                      Log In
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="btn-primary w-full py-3 justify-center">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
