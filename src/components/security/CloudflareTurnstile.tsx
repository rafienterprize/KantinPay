"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";

type TurnstileWidgetId = string;

interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => TurnstileWidgetId;
  reset: (widgetId: TurnstileWidgetId) => void;
  remove?: (widgetId: TurnstileWidgetId) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface CloudflareTurnstileProps {
  siteKey: string;
  action?: string;
  resetTrigger?: number;
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export function CloudflareTurnstile({
  siteKey,
  action = "login",
  resetTrigger = 0,
  onVerify,
  onExpire,
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);

  const renderWidget = () => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current !== null) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      theme: "light",
      callback: (token: string) => onVerify(token),
      "expired-callback": () => {
        onVerify("");
        onExpire?.();
      },
      "error-callback": () => {
        onVerify("");
      },
    });
  };

  useEffect(() => {
    if (window.turnstile) {
      renderWidget();
    }
    return () => {
      if (widgetIdRef.current !== null && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  useEffect(() => {
    if (resetTrigger > 0 && widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onVerify("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  return (
    <div className="flex justify-center pt-1">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div ref={containerRef} />
    </div>
  );
}
