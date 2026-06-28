"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";

export default function ClearCartOnMount() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  return null;
}
