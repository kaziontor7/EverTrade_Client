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
            // Import completeOnboarding dynamically
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
    <div className="flex-grow flex min-h-[calc(100vh-80px)] bg-[var(--bg-color)] w-full">
      <div className="w-full flex flex-row-reverse">
        
        {/* Right Side: Branding/Visuals (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-start px-12 xl:px-24 bg-zinc-950 text-white relative">
          <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none"></div>
          <div className="relative z-10 w-full max-w-lg">
            <h1 className="text-5xl xl:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tighter">
              Join the <br />
              <span className="text-zinc-500">Circular</span> Economy.
            </h1>
            <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-16">
              Create an account to discover premium pre-owned items or start selling your own sustainable products today.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                 <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-zinc-300">shopping_bag</span>
                 </div>
                 <div>
                   <p className="text-lg font-bold text-white">Curated Quality</p>
                   <p className="text-sm text-zinc-500 font-medium mt-1">Every item is verified for authenticity and condition.</p>
                 </div>
              </div>
              <div className="flex items-start gap-5">
                 <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-zinc-300">eco</span>
                 </div>
                 <div>
                   <p className="text-lg font-bold text-white">Eco Impact</p>
                   <p className="text-sm text-zinc-500 font-medium mt-1">Reduce waste and promote sustainable commerce.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 py-12">
          <div className="w-full max-w-[440px]">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
                Create Account
              </h2>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Sign up to get started with EverTrade.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-900/50 text-sm rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-xl mt-0.5">error</span>
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <Form onSubmit={handleSignUp} className="space-y-5" validationBehavior="native">
              
              {/* Role Selection Toggle */}
              <div className="space-y-3 mb-6 w-full">
                <label className="text-sm font-bold text-[var(--text-primary)]">Account Type</label>
                <div className="flex bg-[var(--surface-dim-color)] p-1.5 rounded-xl border border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      role === "buyer" 
                        ? "bg-[var(--surface-color)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]" 
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[1.1rem]">shopping_cart</span>
                    Shop
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      role === "seller" 
                        ? "bg-[var(--surface-color)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]" 
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[1.1rem]">storefront</span>
                    Sell
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <TextField isRequired name="name" value={name} onChange={setName}>
                  <Label className="text-[var(--text-primary)] font-bold pb-1 text-sm">Full Name</Label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[var(--text-muted)] text-lg absolute left-3 pointer-events-none z-10">person</span>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="bg-[var(--surface-dim-color)] border border-[var(--border-color)] h-12 pl-10 pr-4 shadow-sm rounded-lg focus:border-black dark:focus:border-white w-full text-base text-[var(--text-primary)] font-medium outline-none transition-colors"
                    />
                  </div>
                </TextField>
                <TextField isRequired name="phone" value={phone} onChange={setPhone}>
                  <Label className="text-[var(--text-primary)] font-bold pb-1 text-sm">Phone Number</Label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[var(--text-muted)] text-lg absolute left-3 pointer-events-none z-10">call</span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+88017..."
                      className="bg-[var(--surface-dim-color)] border border-[var(--border-color)] h-12 pl-10 pr-4 shadow-sm rounded-lg focus:border-black dark:focus:border-white w-full text-base text-[var(--text-primary)] font-medium outline-none transition-colors"
                    />
                  </div>
                </TextField>
              </div>

              <TextField isRequired name="email" value={email} onChange={setEmail}>
                <Label className="text-[var(--text-primary)] font-bold pb-1 text-sm">Email Address</Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[var(--text-muted)] text-lg absolute left-3 pointer-events-none z-10">mail</span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="bg-[var(--surface-dim-color)] border border-[var(--border-color)] h-12 pl-10 pr-4 shadow-sm rounded-lg focus:border-black dark:focus:border-white w-full text-base text-[var(--text-primary)] font-medium outline-none transition-colors"
                  />
                </div>
              </TextField>

              <TextField isRequired name="password" value={password} onChange={setPassword}>
                <Label className="text-[var(--text-primary)] font-bold pb-1 text-sm">Password</Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[var(--text-muted)] text-lg absolute left-3 pointer-events-none z-10">lock</span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="bg-[var(--surface-dim-color)] border border-[var(--border-color)] h-12 pl-10 pr-4 shadow-sm rounded-lg focus:border-black dark:focus:border-white w-full text-base text-[var(--text-primary)] font-medium outline-none transition-colors"
                  />
                </div>
              </TextField>
              
              <TextField isRequired name="location" value={location} onChange={setLocation}>
                <Label className="text-[var(--text-primary)] font-bold pb-1 text-sm">City / Location</Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[var(--text-muted)] text-lg absolute left-3 pointer-events-none z-10">location_on</span>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="bg-[var(--surface-dim-color)] border border-[var(--border-color)] h-12 pl-10 pr-4 shadow-sm rounded-lg focus:border-black dark:focus:border-white w-full text-base text-[var(--text-primary)] font-medium outline-none transition-colors"
                  />
                </div>
              </TextField>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-6 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold h-12 transition-colors rounded-xl shadow-md"
                endContent={!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              >
                Create Account
              </Button>
            </Form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-[var(--border-color)]"></div>
              <span className="flex-shrink mx-4 text-xs text-[var(--text-muted)] font-bold tracking-widest uppercase">Or</span>
              <div className="flex-grow border-t border-[var(--border-color)]"></div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              type="button"
              className="w-full h-12 flex items-center justify-center gap-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-bold hover:bg-[var(--surface-dim-color)] hover:border-black dark:hover:border-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.77-6.228-6.19 0-3.42 2.788-6.19 6.228-6.19 1.583 0 3.024.577 4.119 1.533l3.078-3.078C19.167 1.833 15.937 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.48 0 10.963-4.557 10.963-11.16 0-.668-.06-1.312-.172-1.935H12.24z"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="text-center text-sm font-medium text-[var(--text-secondary)] pt-8">
              Already have an account?{" "}
              <Link href="/signin" className="text-zinc-900 dark:text-white hover:underline font-bold transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
