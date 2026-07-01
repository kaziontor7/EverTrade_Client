"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function OnboardingGuard({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {

      const hasCompletedProfile = session.user.onboarded === true || (Boolean(session.user.phone) && Boolean(session.user.location));

      // If user is logged in but hasn't onboarded, and they aren't already on the onboarding page
      if (!hasCompletedProfile && pathname !== "/onboarding") {
        router.push("/onboarding");
      }
      
      // If user is logged in and HAS onboarded, but they try to visit the onboarding page
      if (hasCompletedProfile && pathname === "/onboarding") {
        router.push(`/dashboard/${session.user.role || 'buyer'}`);
      }
    }
  }, [session, isPending, pathname, router]);

  const hasCompletedProfile = session?.user?.onboarded === true || (Boolean(session?.user?.phone) && Boolean(session?.user?.location));

  // Prevent flash of content if we are going to redirect
  if (!isPending && session?.user && !hasCompletedProfile && pathname !== "/onboarding") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 flex-grow">
        <div className="w-12 h-12 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
