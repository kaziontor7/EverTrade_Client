"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onSuccess: async () => {
          setLoading(false);
          // Fetch the updated session to get the user's role
          const { data: session } = await authClient.getSession();
          const role = session?.user?.role || "buyer";
          
          // Route dynamically based on user role
          if (role === "admin") {
            router.push("/dashboard/admin");
          } else if (role === "seller") {
            router.push("/dashboard/seller");
          } else {
            router.push("/dashboard/buyer");
          }
        },
        onError: (ctx) => {
          setLoading(false);
          setErrorMsg(ctx.error.message || "Invalid email or password.");
        }
      }
    });
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/" // Google signin defaults to home where navbar will redirect them
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

      <div className="w-full max-w-[1440px] mx-auto flex z-10">
        {/* Left Side: Branding/Visuals (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-start px-12 xl:px-24">
          <div className="animate-slide-up stagger-1">
            <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 dark:text-[#e2e8f0] leading-tight mb-6">
              Welcome back to <br />
              <span className="text-gradient">Sustainable</span> Commerce.
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#94a3b8] max-w-md leading-relaxed">
              Sign in to manage your listings, track your orders, and continue contributing to the circular economy.
            </p>
          </div>
          
          <div className="mt-12 animate-slide-up stagger-2 flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#0d1527]/50 border border-gray-200 dark:border-[#475569]/10 backdrop-blur-sm">
             <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-400">shield_lock</span>
             </div>
             <div>
               <p className="text-sm font-semibold text-gray-900 dark:text-[#e2e8f0]">Secure Authentication</p>
               <p className="text-xs text-gray-600 dark:text-[#94a3b8]">Your data is encrypted and protected.</p>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[440px] glass-card glass-card-hover rounded-3xl p-8 sm:p-10 animate-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#e2e8f0] mb-2">
                Sign In
              </h2>
              <p className="text-sm text-gray-600 dark:text-[#94a3b8]">
                Enter your credentials to access your account.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 bg-error/10 border border-error/20 text-error text-sm rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-xl mt-0.5">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-1">
                <label className="et-label" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-600 dark:text-[#94a3b8] text-lg">mail</span>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="et-input pl-11"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="et-label mb-0" htmlFor="password">Password</label>
                  <a href="#" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-600 dark:text-[#94a3b8] text-lg">lock</span>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="et-input pl-11"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading ? (
                   <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                   <>
                     Sign In
                     <span className="material-symbols-outlined text-lg">arrow_forward</span>
                   </>
                )}
              </button>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-[#475569]/20"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-600 dark:text-[#94a3b8] font-medium tracking-wider uppercase">Or continue with</span>
              <div className="flex-grow border-t border-gray-300 dark:border-[#475569]/20"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
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
              Don't have an account?{" "}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
