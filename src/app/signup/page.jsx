"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Input, Button, Select, SelectItem } from "@heroui/react";
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
      role,
      phone,
      location,
      fetchOptions: {
        onSuccess: () => {
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
      callbackURL: role === "seller" ? "/dashboard/seller" : "/dashboard/buyer"
    });
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 bg-background">
      <Card className="w-full max-w-md bg-surface border border-outline/10 shadow-2xl rounded-2xl p-6">
        <Card.Content className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">
              Create an Account
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Join EverTrade to start buying and selling sustainably.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              required
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onValueChange={setName}
              variant="bordered"
              classNames={{
                inputWrapper: "border-outline/20 hover:border-secondary focus-within:border-secondary rounded-xl"
              }}
            />

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
              placeholder="Min 6 characters"
              value={password}
              onValueChange={setPassword}
              variant="bordered"
              classNames={{
                inputWrapper: "border-outline/20 hover:border-secondary focus-within:border-secondary rounded-xl"
              }}
            />

            <Input
              required
              label="Phone Number"
              placeholder="+88017..."
              value={phone}
              onValueChange={setPhone}
              variant="bordered"
              classNames={{
                inputWrapper: "border-outline/20 hover:border-secondary focus-within:border-secondary rounded-xl"
              }}
            />

            <Input
              required
              label="Location"
              placeholder="City, Country"
              value={location}
              onValueChange={setLocation}
              variant="bordered"
              classNames={{
                inputWrapper: "border-outline/20 hover:border-secondary focus-within:border-secondary rounded-xl"
              }}
            />

            <Select
              required
              label="Register As"
              selectedKeys={[role]}
              onSelectionChange={(keys) => setRole(Array.from(keys)[0])}
              variant="bordered"
              classNames={{
                trigger: "border-outline/20 hover:border-secondary focus-within:border-secondary rounded-xl"
              }}
            >
              <SelectItem key="buyer" textValue="Buyer (For shopping)">
                Buyer (For shopping)
              </SelectItem>
              <SelectItem key="seller" textValue="Seller (For listing products)">
                Seller (For listing products)
              </SelectItem>
            </Select>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-secondary hover:bg-secondary-container text-on-surface font-semibold py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(71,104,0,0.15)]"
            >
              Sign Up
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-outline/10"></div>
            <span className="flex-shrink mx-4 text-xs text-on-surface-variant font-medium">Or continue with</span>
            <div className="flex-grow border-t border-outline/10"></div>
          </div>

          <Button
            variant="bordered"
            onPress={handleGoogleSignUp}
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
            Already have an account?{" "}
            <Link href="/signin" className="text-secondary hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
