"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@heroui/react';
import { authClient } from '../lib/auth-client';

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
    <header className="sticky top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline/10">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center px-6 md:px-12 h-20">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                eco
              </span>
              <span className="text-xl font-bold tracking-tight text-on-surface hover:text-secondary transition-colors">
                Ever<span className="text-secondary">Trade</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-medium text-sm transition-colors py-1 ${
                    isActive
                      ? 'text-secondary border-b-2 border-secondary'
                      : 'text-on-surface-variant hover:text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Section (Auth / Call-To-Action) */}
        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            <div className="w-24 h-9 bg-surface-container-high animate-pulse rounded-xl"></div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-on-surface-variant">
                Hi, <span className="text-on-surface font-semibold">{session.user.name.split(' ')[0]}</span>
              </span>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary-container text-on-primary font-semibold px-4 py-1.5 rounded-xl transition-all"
                onPress={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin" className="text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors">
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="bg-secondary text-on-surface hover:bg-secondary-container font-semibold px-5 py-1.5 rounded-xl transition-all shadow-[0_0_15px_rgba(71,104,0,0.2)]">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-on-surface hover:text-secondary focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-[80px] left-0 w-full bg-surface border-b border-outline/10 flex flex-col p-6 gap-6 md:hidden z-50 shadow-xl">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="w-full h-px bg-outline/10"></div>

            <div className="flex flex-col gap-4">
              {isPending ? (
                <div className="w-full h-10 bg-surface-container-high animate-pulse rounded-xl"></div>
              ) : session ? (
                <>
                  <span className="text-sm text-on-surface-variant">
                    Hi, <span className="text-on-surface font-semibold">{session.user.name}</span>
                  </span>
                  <Button
                    className="bg-primary text-on-primary font-semibold py-2 rounded-xl transition-all w-full"
                    onPress={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="bg-secondary text-on-surface font-semibold py-2 rounded-xl transition-all w-full shadow-[0_0_15px_rgba(71,104,0,0.2)]">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
