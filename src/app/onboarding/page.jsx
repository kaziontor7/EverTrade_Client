"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { completeOnboarding } from "@/lib/actions/user";
import { toast } from "@heroui/react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [role, setRole] = useState("buyer");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) return;

    if (!phone.trim() || !location.trim()) {
      toast.danger("Phone and location are required to complete your profile.");
      return;
    }

    setLoading(true);
    try {
      // 1. Force the database update bypassing plugin restrictions
      const res = await completeOnboarding(session.user.id, { role, phone, location });
      
      if (res.success) {
        // 2. Trigger a JWT refresh by updating a safe field (name to itself)
        await authClient.updateUser({ name: session.user.name });
        
        toast.success("Profile completed successfully!");
        window.location.href = `/dashboard/${role}`;
      } else {
        toast.danger(res.message || "Failed to update profile.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.danger("An error occurred during onboarding.");
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gray-50 dark:bg-[#060e20]">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      
      <div className="w-full max-w-xl glass-card rounded-3xl p-8 sm:p-12 relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Welcome to EverTrade! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's get your profile set up so you can start {role === 'buyer' ? 'shopping' : 'selling'}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">What brings you here today?</label>
            <div className="grid grid-cols-2 gap-4">
              <label 
                className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  role === 'buyer' 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-gray-200 dark:border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                }`}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value="buyer" 
                  checked={role === 'buyer'} 
                  onChange={() => setRole('buyer')}
                  className="sr-only" 
                />
                <span className={`material-symbols-outlined text-4xl mb-2 ${role === 'buyer' ? 'text-emerald-500' : 'text-gray-400'}`}>
                  shopping_cart
                </span>
                <span className={`font-semibold ${role === 'buyer' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  I want to Buy
                </span>
              </label>

              <label 
                className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  role === 'seller' 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-gray-200 dark:border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                }`}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value="seller" 
                  checked={role === 'seller'} 
                  onChange={() => setRole('seller')}
                  className="sr-only" 
                />
                <span className={`material-symbols-outlined text-4xl mb-2 ${role === 'seller' ? 'text-emerald-500' : 'text-gray-400'}`}>
                  storefront
                </span>
                <span className={`font-semibold ${role === 'seller' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  I want to Sell
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-700 dark:text-blue-300 flex items-start gap-3">
               <span className="material-symbols-outlined text-[20px]">info</span>
               <p>To keep our marketplace safe and ensure smooth deliveries, all users must provide their contact details.</p>
            </div>

            <div className="space-y-2">
              <label className="et-label">Phone Number</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">call</span>
                <input
                  type="tel"
                  required
                  placeholder="+8801XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="et-input pl-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="et-label">{role === 'seller' ? 'Store Location' : 'Delivery Location'}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">location_on</span>
                <input
                  type="text"
                  required
                  placeholder="Dhaka, Bangladesh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="et-input pl-11"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg mt-6"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
