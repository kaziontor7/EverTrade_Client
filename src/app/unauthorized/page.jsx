"use client";

import React from "react";
import Link from "next/link";
import { Button, Card } from "@heroui/react";

export default function UnauthorizedPage() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] py-24 px-4 bg-transparent">
      <Card className="w-full max-w-md bg-white dark:bg-[#0d1527] border border-gray-200 dark:border-[#475569]/10 shadow-2xl rounded-2xl p-6 text-center">
        <Card.Content className="space-y-6 py-8">
          <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center mx-auto text-error">
            <span className="material-symbols-outlined text-4xl">block</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#e2e8f0]">
              Access Denied
            </h1>
            <p className="text-sm text-gray-600 dark:text-[#94a3b8] max-w-sm mx-auto">
              You do not have the required permissions to view this dashboard page. If you think this is a mistake, please contact support.
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Link href="/signin">
              <Button size="md" className="bg-secondary text-gray-900 dark:text-[#e2e8f0] font-semibold px-6 py-2 rounded-xl transition-all">
                Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button size="md" variant="bordered" className="border-gray-300 dark:border-[#475569]/20 hover:border-secondary text-gray-900 dark:text-[#e2e8f0] font-semibold px-6 py-2 rounded-xl transition-all">
                Go Home
              </Button>
            </Link>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
