"use client";

import { useEffect, useState } from "react";
import { syncCheckoutAction } from "@/lib/actions/checkout";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function SyncCheckoutOnMount({ checkoutData }) {
  const [synced, setSynced] = useState(false);
  const router = useRouter();
  const { refreshCart } = useCart();

  useEffect(() => {
    if (!synced) {
      syncCheckoutAction(checkoutData)
        .then(() => {
          setSynced(true);
          refreshCart();
          // Optional: refresh the router so the page fetches the newly created orders
          router.refresh();
        })
        .catch(console.error);
    }
  }, [checkoutData, synced, router, refreshCart]);

  return null;
}
