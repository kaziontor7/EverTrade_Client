"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { completeOnboarding } from "@/lib/actions/user";
import { Form, Input, Button, TextField, Label, toast } from "@heroui/react";

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
        <div className="w-12 h-12 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-transparent">
      
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 shadow-xl rounded-3xl p-8 sm:p-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase mb-3">Welcome to EverTrade!</h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">
            Let's get your profile set up so you can start {role === 'buyer' ? 'shopping' : 'selling'}.
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-8" validationBehavior="native">
          <div className="space-y-4 w-full mb-6">
            <label className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">What brings you here today?</label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 w-full">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all uppercase tracking-wider ${
                  role === "buyer" 
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm border border-zinc-900 dark:border-white" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[1.1rem]">shopping_cart</span>
                I want to Buy
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all uppercase tracking-wider ${
                  role === "seller" 
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm border border-zinc-900 dark:border-white" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[1.1rem]">storefront</span>
                I want to Sell
              </button>
            </div>
          </div>

          <div className="space-y-6 w-full">
            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white flex items-start gap-3 font-medium">
               <span className="material-symbols-outlined text-[20px]">info</span>
               <p>To keep our marketplace safe and ensure smooth deliveries, all users must provide their contact details.</p>
            </div>

            <TextField isRequired name="phone" value={phone} onChange={setPhone} className="w-full">
              <Label className="text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-xs pb-1">Phone Number</Label>
              <div className="relative flex items-center w-full">
                <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-lg absolute left-3 pointer-events-none">call</span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+8801XXXXXXXXX"
                  className="pl-10 w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 font-bold focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                />
              </div>
            </TextField>
            
            <TextField isRequired name="location" value={location} onChange={setLocation} className="w-full">
              <Label className="text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-xs pb-1">{role === 'seller' ? 'Store Location' : 'Delivery Location'}</Label>
              <div className="relative flex items-center w-full">
                <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-lg absolute left-3 pointer-events-none">location_on</span>
                <Input
                  id="location"
                  type="text"
                  placeholder="Dhaka, Bangladesh"
                  className="pl-10 w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 font-bold focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                />
              </div>
            </TextField>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-6 text-lg mt-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold uppercase tracking-widest shadow-sm transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
            endContent={!loading && <span className="material-symbols-outlined">arrow_forward</span>}
          >
            Complete Profile
          </Button>
        </Form>
      </div>
    </div>
  );
}
