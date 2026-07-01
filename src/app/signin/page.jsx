"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Button, TextField, Label } from "@heroui/react";
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
      callbackURL: "/onboarding"
    });
  };

  return (
    <div className="flex-grow flex min-h-[calc(100vh-80px)] bg-[var(--bg-color)] w-full">
      <div className="w-full flex">
        {/* Left Side: Branding/Visuals (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-start px-12 xl:px-24 bg-zinc-950 text-white relative">
          <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none"></div>
          <div className="relative z-10 w-full max-w-lg">
            <h1 className="text-5xl xl:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tighter">
              Welcome back to <br />
              <span className="text-zinc-500">EverTrade.</span>
            </h1>
            <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-16">
              Sign in to manage your listings, track your orders, and continue contributing to the circular economy.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                 <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-zinc-300">shield_lock</span>
                 </div>
                 <div>
                   <p className="text-lg font-bold text-white">Secure Authentication</p>
                   <p className="text-sm text-zinc-500 font-medium mt-1">Your data is encrypted and protected at all times.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[400px]">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
                Sign In
              </h2>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Enter your credentials to access your account.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-900/50 text-sm rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-xl mt-0.5">error</span>
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <Form onSubmit={handleSignIn} className="space-y-5" validationBehavior="native">
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

              <div className="w-full space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-[var(--text-primary)]" htmlFor="password">Password</label>
                  <a href="#" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors z-10 relative">Forgot password?</a>
                </div>
                <TextField isRequired name="password" value={password} onChange={setPassword}>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[var(--text-muted)] text-lg absolute left-3 pointer-events-none z-10">lock</span>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="bg-[var(--surface-dim-color)] border border-[var(--border-color)] h-12 pl-10 pr-4 shadow-sm rounded-lg focus:border-black dark:focus:border-white w-full text-base text-[var(--text-primary)] font-medium outline-none transition-colors"
                    />
                  </div>
                </TextField>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-6 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold h-12 transition-colors rounded-xl shadow-md"
                endContent={!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              >
                Sign In
              </Button>
            </Form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-[var(--border-color)]"></div>
              <span className="flex-shrink mx-4 text-xs text-[var(--text-muted)] font-bold tracking-widest uppercase">Or</span>
              <div className="flex-grow border-t border-[var(--border-color)]"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full h-12 flex items-center justify-center gap-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-bold hover:bg-[var(--surface-dim-color)] hover:border-black dark:hover:border-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.77-6.228-6.19 0-3.42 2.788-6.19 6.228-6.19 1.583 0 3.024.577 4.119 1.533l3.078-3.078C19.167 1.833 15.937 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.48 0 10.963-4.557 10.963-11.16 0-.668-.06-1.312-.172-1.935H12.24z"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="text-center text-sm font-medium text-[var(--text-secondary)] pt-8">
              Don't have an account?{" "}
              <Link href="/signup" className="text-zinc-900 dark:text-white hover:underline font-bold transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
