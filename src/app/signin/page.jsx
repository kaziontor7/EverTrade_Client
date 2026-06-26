"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Input, Button } from "@heroui/react";
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
    <div className="flex-grow flex items-center justify-center py-12 px-4 bg-background">
      <Card className="w-full max-w-md bg-surface border border-outline/10 shadow-2xl rounded-2xl p-6">
        <Card.Content className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">
              Welcome Back
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Sign in to manage your EverTrade listings and orders.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              required
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onValueChange={setEmail}
              variant="bordered"
              classNames={{
                inputWrapper: "border-outline/20 hover:border-secondary focus-within:border-secondary rounded-xl"
              }}
            />

            <Input
              required
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              variant="bordered"
              classNames={{
                inputWrapper: "border-outline/20 hover:border-secondary focus-within:border-secondary rounded-xl"
              }}
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-secondary hover:bg-secondary-container text-on-surface font-semibold py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(71,104,0,0.15)]"
            >
              Sign In
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-outline/10"></div>
            <span className="flex-shrink mx-4 text-xs text-on-surface-variant font-medium">Or continue with</span>
            <div className="flex-grow border-t border-outline/10"></div>
          </div>

          <Button
            variant="bordered"
            onPress={handleGoogleSignIn}
            className="w-full border-outline/20 hover:border-secondary text-on-surface rounded-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.77-6.228-6.19 0-3.42 2.788-6.19 6.228-6.19 1.583 0 3.024.577 4.119 1.533l3.078-3.078C19.167 1.833 15.937 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.48 0 10.963-4.557 10.963-11.16 0-.668-.06-1.312-.172-1.935H12.24z"
              />
            </svg>
            Google OAuth
          </Button>

          <div className="text-center text-sm text-on-surface-variant pt-2">
            Don't have an account?{" "}
            <Link href="/signup" className="text-secondary hover:underline font-semibold">
              Sign Up
            </Link>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
