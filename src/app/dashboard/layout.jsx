"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const role = session?.user?.role || "buyer";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 font-outfit">
              Dashboard
            </h2>
            <nav className="space-y-2">
              <Link 
                href={`/dashboard/${role}`} 
                className="flex items-center space-x-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all font-medium border border-emerald-500/20"
              >
                <span>{role === 'seller' ? 'My Listings' : 'My Orders'}</span>
              </Link>
              {role === 'buyer' && (
                <Link 
                  href="/dashboard/buyer/wishlist" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-all font-medium"
                >
                  <span>Wishlist</span>
                </Link>
              )}
              {role === 'seller' && (
                <Link 
                  href="/dashboard/seller/orders" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-all font-medium"
                >
                  <span>Sales History</span>
                </Link>
              )}
              <Link 
                href="/dashboard/settings" 
                className="flex items-center space-x-3 px-4 py-3 text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-all font-medium"
              >
                <span>Settings</span>
              </Link>
            </nav>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-gray-950 font-bold uppercase">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{session?.user?.name}</p>
                  <p className="text-gray-400 text-xs capitalize">{role}</p>
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
