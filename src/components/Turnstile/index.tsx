"use client";
import { useEffect, useRef } from "react";

interface Turnstile {
  render(
    element: HTMLElement,
    options: {
      sitekey?: string;
      callback?: (token: string) => void;
      theme?: "light" | "dark" | "auto";
    },
  ): void;
}

declare global {
  interface Window {
    turnstile: Turnstile;
  }
}

export const Turnstile = ({
  onSuccess,
}: {
  onSuccess?: (token: string) => void;
}) => {
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent duplicate script loading
    const scriptId = "cf-turnstile-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const ref = turnstileRef.current;

    const renderTurnstile = () => {
      if (
        window.turnstile &&
        ref &&
        !ref.hasAttribute("data-turnstile-rendered")
      ) {
        window.turnstile.render(ref, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            if (onSuccess) onSuccess(token);
          },
          theme: "light",
        });
        ref.setAttribute("data-turnstile-rendered", "true");
      }
    };

    if (script) {
      // If turnstile is already loaded, render immediately
      if (window.turnstile) {
        renderTurnstile();
      } else {
        script.onload = renderTurnstile;
      }
    }

    return () => {
      // Cleanup widget only, not script
      if (ref) {
        ref.innerHTML = "";
        ref.removeAttribute("data-turnstile-rendered");
      }
    };
  }, [onSuccess]);

  return <div ref={turnstileRef} className="cf-turnstile" />;
};
