"use client";

import React from "react";
import Link from "next/link";
import { Button, Card } from "@heroui/react";

export default function UnauthorizedPage() {
  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 bg-background">
      <Card className="w-full max-w-md bg-surface border border-outline/10 shadow-2xl rounded-2xl p-6 text-center">
        <Card.Content className="space-y-6 py-8">
          <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center mx-auto text-error">
            <span className="material-symbols-outlined text-4xl">block</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Access Denied
            </h1>
            <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
              You do not have the required permissions to view this dashboard page. If you think this is a mistake, please contact support.
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Link href="/signin">
              <Button size="md" className="bg-secondary text-on-surface font-semibold px-6 py-2 rounded-xl transition-all">
                Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button size="md" variant="bordered" className="border-outline/20 hover:border-secondary text-on-surface font-semibold px-6 py-2 rounded-xl transition-all">
                Go Home
              </Button>
            </Link>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
