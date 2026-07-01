"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  const role = (session?.user?.role || "buyer").toLowerCase();

  // Role Protection
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    router.push("/unauthorized");
    return null;
  }
  if (pathname.startsWith("/dashboard/seller") && role !== "seller" && role !== "admin") {
    router.push("/unauthorized");
    return null;
  }



  const getLinkClasses = (path) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center space-x-3 px-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-bold transition-all"
      : "flex items-center space-x-3 px-4 py-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-all font-medium";
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 pr-4">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">
              Dashboard
            </h2>
            <nav className="space-y-2">
              {role === 'admin' ? (
                <>
                  <Link href="/dashboard/admin" className={getLinkClasses("/dashboard/admin")}>
                    <span className="material-symbols-outlined text-xl">dashboard</span>
                    <span>Overview</span>
                  </Link>
                  <Link href="/dashboard/admin/users" className={getLinkClasses("/dashboard/admin/users")}>
                    <span className="material-symbols-outlined text-xl">group</span>
                    <span>Manage Users</span>
                  </Link>
                  <Link href="/dashboard/admin/products" className={getLinkClasses("/dashboard/admin/products")}>
                    <span className="material-symbols-outlined text-xl">inventory</span>
                    <span>Manage Products</span>
                  </Link>
                  <Link href="/dashboard/admin/orders" className={getLinkClasses("/dashboard/admin/orders")}>
                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                    <span>Manage Orders</span>
                  </Link>
                  <Link href="/dashboard/admin/analytics" className={getLinkClasses("/dashboard/admin/analytics")}>
                    <span className="material-symbols-outlined text-xl">insights</span>
                    <span>Platform Analytics</span>
                  </Link>
                </>
              ) : role === 'seller' ? (
                <>
                  <Link href="/dashboard/seller" className={getLinkClasses("/dashboard/seller")}>
                    <span className="material-symbols-outlined text-xl">dashboard</span>
                    <span>Overview</span>
                  </Link>
                  <Link href="/dashboard/seller/add-product" className={getLinkClasses("/dashboard/seller/add-product")}>
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    <span>Add Product</span>
                  </Link>
                  <Link href="/dashboard/seller/products" className={getLinkClasses("/dashboard/seller/products")}>
                    <span className="material-symbols-outlined text-xl">inventory_2</span>
                    <span>My Products</span>
                  </Link>
                  <Link href="/dashboard/seller/orders" className={getLinkClasses("/dashboard/seller/orders")}>
                    <span className="material-symbols-outlined text-xl">list_alt</span>
                    <span>Manage Orders</span>
                  </Link>
                  <Link href="/dashboard/seller/analytics" className={getLinkClasses("/dashboard/seller/analytics")}>
                    <span className="material-symbols-outlined text-xl">bar_chart</span>
                    <span>Sales Analytics</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard/buyer" className={getLinkClasses("/dashboard/buyer")}>
                    <span className="material-symbols-outlined text-xl">dashboard</span>
                    <span>Overview</span>
                  </Link>
                  <Link href="/dashboard/buyer/orders" className={getLinkClasses("/dashboard/buyer/orders")}>
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                    <span>My Orders</span>
                  </Link>
                  <Link href="/dashboard/buyer/wishlist" className={getLinkClasses("/dashboard/buyer/wishlist")}>
                    <span className="material-symbols-outlined text-xl">favorite</span>
                    <span>Wishlist</span>
                  </Link>
                  <Link href="/dashboard/buyer/payments" className={getLinkClasses("/dashboard/buyer/payments")}>
                    <span className="material-symbols-outlined text-xl">payments</span>
                    <span>Payment History</span>
                  </Link>
                </>
              )}
              
              <Link href="/dashboard/settings" className={getLinkClasses("/dashboard/settings")}>
                <span className="material-symbols-outlined text-xl">settings</span>
                <span>Settings</span>
              </Link>
            </nav>
            
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center space-x-3 px-4">
                <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold uppercase">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-zinc-900 dark:text-white font-bold text-sm leading-none">{session?.user?.name}</p>
                  <p className="text-zinc-500 text-xs capitalize mt-1">{role}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
