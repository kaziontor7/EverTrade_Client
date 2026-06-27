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

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const role = session?.user?.role || "buyer";

  const getLinkClasses = (path) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center space-x-3 px-4 py-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all font-medium border border-emerald-500/20"
      : "flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-white/5 hover:text-gray-900 dark:text-white transition-all font-medium";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 sticky top-24 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-outfit">
              Dashboard
            </h2>
            <nav className="space-y-2">
              {role === 'admin' ? (
                <>
                  <Link href="/dashboard/admin" className={getLinkClasses("/dashboard/admin")}>
                    <span>Overview</span>
                  </Link>
                  <Link href="/dashboard/admin/users" className={getLinkClasses("/dashboard/admin/users")}>
                    <span>User Management</span>
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
                    <span>My Orders</span>
                  </Link>
                  <Link href="/dashboard/buyer/wishlist" className={getLinkClasses("/dashboard/buyer/wishlist")}>
                    <span>Wishlist</span>
                  </Link>
                </>
              )}
              
              <Link href="/dashboard/settings" className={getLinkClasses("/dashboard/settings")}>
                {role === 'seller' && <span className="material-symbols-outlined text-xl">settings</span>}
                <span>Settings</span>
              </Link>
            </nav>
            
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold uppercase border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium text-sm">{session?.user?.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs capitalize">{role}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
