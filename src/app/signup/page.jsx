"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Button, TextField, Label } from "@heroui/react";
import { authClient } from "../../lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    await authClient.signUp.email({
      name,
      email,
      password,
      fetchOptions: {
        onSuccess: async (ctx) => {
          try {
            // Import completeOnboarding dynamically or we can just import it at the top
            const { completeOnboarding } = await import('@/lib/actions/user');
            await completeOnboarding(ctx.data.user.id, { role, phone, location });
            // Refresh session to get updated role
            await authClient.updateUser({ name: ctx.data.user.name });
          } catch (err) {
            console.error("Failed to complete onboarding", err);
          }
          setLoading(false);
          // Redirect dynamically based on role
          router.push(role === "seller" ? "/dashboard/seller" : "/dashboard/buyer");
        },
        onError: (ctx) => {
          setLoading(false);
          setErrorMsg(ctx.error.message || "An error occurred during sign up.");
        }
      }
    });
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg("");
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/onboarding"
    });
  };

  return (
    <div className="flex-grow flex min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#060e20] relative overflow-hidden animate-fade-in">
      {/* Decorative Orbs */}
      <div className="orb orb-emerald w-[500px] h-[500px] top-[-100px] left-[-100px]"></div>
      <div className="orb orb-lime w-[400px] h-[400px] bottom-[-50px] right-[-50px]"></div>
      <div className="orb orb-cyan w-[600px] h-[600px] top-[20%] left-[40%] opacity-20"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-50"></div>

      <div className="w-full max-w-[1440px] mx-auto flex flex-row-reverse z-10">
        {/* Right Side: Branding/Visuals (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-start px-12 xl:px-24">
          <div className="animate-slide-up stagger-1">
            <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 dark:text-[#e2e8f0] leading-tight mb-6">
              Join the <br />
              <span className="text-gradient">Circular</span> Economy.
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#94a3b8] max-w-md leading-relaxed">
              Create an account to discover premium pre-owned items or start selling your own sustainable products today.
            </p>
          </div>
          
          <div className="mt-12 animate-slide-up stagger-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1527]/50 border border-gray-200 dark:border-[#475569]/10 backdrop-blur-sm">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">shopping_bag</span>
               </div>
               <p className="text-sm font-semibold text-gray-900 dark:text-[#e2e8f0]">Curated Quality</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1527]/50 border border-gray-200 dark:border-[#475569]/10 backdrop-blur-sm">
               <div className="w-10 h-10 rounded-full bg-lime-500/20 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-lime-400 text-lg">public</span>
               </div>
               <p className="text-sm font-semibold text-gray-900 dark:text-[#e2e8f0]">Eco Impact</p>
            </div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 py-12">
          <div className="w-full max-w-[480px] glass-card glass-card-hover rounded-3xl p-8 sm:p-10 animate-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#e2e8f0] mb-2">
                Create Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-[#94a3b8]">
                Sign up to get started with EverTrade.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 bg-error/10 border border-error/20 text-error text-sm rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-xl mt-0.5">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <Form onSubmit={handleSignUp} className="space-y-5" validationBehavior="native">
              
              {/* Role Selection Toggle */}
              <div className="space-y-2 mb-6 w-full">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-200">I want to...</label>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
                      role === "buyer" 
                        ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                        : "border-gray-300 dark:border-[#475569]/20 bg-white dark:bg-[#0d1527]/40 hover:bg-white dark:bg-[#0d1527] hover:border-emerald-500/40"
                    }`}
                  >
                    <span className={`material-symbols-outlined mb-2 ${role === "buyer" ? "text-emerald-400" : "text-gray-600 dark:text-[#94a3b8]"}`}>
                      shopping_cart
                    </span>
                    <span className={`text-sm font-semibold ${role === "buyer" ? "text-emerald-400" : "text-gray-600 dark:text-[#94a3b8]"}`}>
                      Shop & Buy
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
                      role === "seller" 
                        ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                        : "border-gray-300 dark:border-[#475569]/20 bg-white dark:bg-[#0d1527]/40 hover:bg-white dark:bg-[#0d1527] hover:border-emerald-500/40"
                    }`}
                  >
                    <span className={`material-symbols-outlined mb-2 ${role === "seller" ? "text-emerald-400" : "text-gray-600 dark:text-[#94a3b8]"}`}>
                      storefront
                    </span>
                    <span className={`text-sm font-semibold ${role === "seller" ? "text-emerald-400" : "text-gray-600 dark:text-[#94a3b8]"}`}>
                      List & Sell
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <TextField isRequired name="name" value={name} onChange={setName}>
                  <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Full Name</Label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-gray-400 dark:text-[#94a3b8] text-lg absolute left-3 pointer-events-none">person</span>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2"
                    />
                  </div>
                </TextField>
                <TextField isRequired name="phone" value={phone} onChange={setPhone}>
                  <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Phone Number</Label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-gray-400 dark:text-[#94a3b8] text-lg absolute left-3 pointer-events-none">call</span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+88017..."
                      className="pl-10 w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2"
                    />
                  </div>
                </TextField>
              </div>

              <TextField isRequired name="email" value={email} onChange={setEmail}>
                <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Email Address</Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#94a3b8] text-lg absolute left-3 pointer-events-none">mail</span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2"
                  />
                </div>
              </TextField>

              <TextField isRequired name="password" value={password} onChange={setPassword}>
                <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Password</Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#94a3b8] text-lg absolute left-3 pointer-events-none">lock</span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 6 characters"
                    className="pl-10 w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2"
                  />
                </div>
              </TextField>

              <TextField isRequired name="location" value={location} onChange={setLocation}>
                <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Location</Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#94a3b8] text-lg absolute left-3 pointer-events-none">location_on</span>
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, Country"
                    className="pl-10 w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2"
                  />
                </div>
              </TextField>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-medium"
                endContent={!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              >
                Create Account
              </Button>
            </Form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-[#475569]/20"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-600 dark:text-[#94a3b8] font-medium tracking-wider uppercase">Or continue with</span>
              <div className="flex-grow border-t border-gray-300 dark:border-[#475569]/20"></div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              type="button"
              className="btn-secondary w-full"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.77-6.228-6.19 0-3.42 2.788-6.19 6.228-6.19 1.583 0 3.024.577 4.119 1.533l3.078-3.078C19.167 1.833 15.937 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.48 0 10.963-4.557 10.963-11.16 0-.668-.06-1.312-.172-1.935H12.24z"
                />
              </svg>
              Google
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-[#94a3b8] pt-8">
              Already have an account?{" "}
              <Link href="/signin" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
