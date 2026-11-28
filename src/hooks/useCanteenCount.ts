"use client";

import { useState, useEffect } from "react";

export function useCanteenCount(initialCount = 8): number {
  const [canteenCount, setCanteenCount] = useState<number>(initialCount);

  useEffect(() => {
    let active = true;

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/public/stats", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (active && typeof data.canteenCount === "number" && data.canteenCount > 0) {
            setCanteenCount(data.canteenCount);
          }
        }
      } catch {
        // Keep fallback count
      }
    };

    fetchCount();
    return () => {
      active = false;
    };
  }, []);

  return canteenCount;
}
