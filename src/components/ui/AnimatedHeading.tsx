"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  children?: React.ReactNode;
  text?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  stagger?: number;
  scrub?: boolean;
}

export function AnimatedHeading({
  children,
  text,
  as: Component = "h2",
  className,
  stagger = 0.04,
  scrub = false,
}: AnimatedHeadingProps) {
  const containerRef = useRef<HTMLHeadingElement | null>(null);

  // Extract raw text from string props or children
  const rawText =
    text ||
    (typeof children === "string"
      ? children
      : React.Children.toArray(children)
          .map((child) => (typeof child === "string" ? child : ""))
          .join(" "));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll(".gsap-word");
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      if (scrub) {
        // Scrubbed lighting up word by word as user scrolls down
        // No overflow-hidden so descenders (g, j, p, q, y) are never cut off
        gsap.fromTo(
          words,
          {
            opacity: 0.18,
            y: 4,
          },
          {
            opacity: 1,
            y: 0,
            stagger: stagger,
            ease: "power1.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          }
        );
      } else {
        // Smooth entrance animation without clipping
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 10,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: stagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [stagger, scrub]);

  // Split text by whitespace into array of words
  const wordsList = rawText.trim().split(/\s+/).filter(Boolean);

  return (
    <Component
      ref={containerRef}
      className={cn("inline-block pb-1.5", className)}
    >
      {wordsList.map((word, index) => (
        <span
          key={index}
          className="inline-block mr-[0.28em] last:mr-0 py-0.5 overflow-visible"
        >
          <span className="gsap-word inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
