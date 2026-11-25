"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: ScrollToOptions) => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
});

export function useLenisScroll() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    setLenisInstance(lenis);

    // @ts-expect-error global window lenis attachment
    window.__lenis = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
      // @ts-expect-error global window lenis cleanup
      window.__lenis = null;
      setLenisInstance(null);
    };
  }, []);

  // Scroll to top smoothly on page transition
  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenisInstance]);

  const scrollTo = (
    target: string | number | HTMLElement,
    options: ScrollToOptions = {}
  ) => {
    const targetOffset = options.offset ?? -85;
    const targetDuration = options.duration ?? 1.25;

    let targetEl: HTMLElement | null = null;
    if (target instanceof HTMLElement) {
      targetEl = target;
    } else if (typeof target === "string" && target.startsWith("#")) {
      targetEl =
        document.getElementById(target.slice(1)) ||
        (document.querySelector(target) as HTMLElement | null);
    }

    if (lenisInstance) {
      try {
        if (targetEl) {
          lenisInstance.scrollTo(targetEl, {
            offset: targetOffset,
            duration: targetDuration,
            immediate: options.immediate ?? false,
          });
        } else {
          lenisInstance.scrollTo(target, {
            offset: targetOffset,
            duration: targetDuration,
            immediate: options.immediate ?? false,
          });
        }
      } catch (err) {
        console.warn("Lenis scrollTo fallback triggered:", err);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else {
      // Fallback
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    }
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
