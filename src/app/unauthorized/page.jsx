"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function UnauthorizedPage() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] py-24 px-4 bg-transparent">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 shadow-xl rounded-3xl p-10 text-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto text-zinc-900 dark:text-white mb-8 shadow-sm">
            <span className="material-symbols-outlined text-4xl">block</span>
          </div>

          <div className="space-y-3 mb-8">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
              Access Denied
            </h1>
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              You do not have the required permissions to view this dashboard page. If you think this is a mistake, please contact support.
            </p>
          </div>

          <div className="flex flex-col w-full gap-4">
            <Link href="/signin" className="w-full">
              <Button size="lg" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button size="lg" variant="flat" className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold uppercase tracking-wider rounded-xl transition-all">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
