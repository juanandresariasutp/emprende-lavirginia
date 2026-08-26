"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "auto";
      size: "flexible";
      "response-field": false;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  siteKey,
  action,
  resetKey,
  onTokenChange,
}: {
  siteKey: string | null;
  action: string;
  resetKey: string;
  onTokenChange: (ready: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const previousResetKey = useRef(resetKey);
  const [token, setToken] = useState("");
  const [hasError, setHasError] = useState(false);

  const clearToken = useCallback(() => {
    setToken("");
    onTokenChange(false);
  }, [onTokenChange]);

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      theme: "auto",
      size: "flexible",
      "response-field": false,
      callback: (nextToken) => {
        if (!nextToken) {
          clearToken();
          return;
        }
        setHasError(false);
        setToken(nextToken);
        onTokenChange(true);
      },
      "expired-callback": clearToken,
      "error-callback": () => {
        setHasError(true);
        clearToken();
      },
    });
  }, [action, clearToken, onTokenChange, siteKey]);

  useEffect(() => {
    if (previousResetKey.current === resetKey) return;
    previousResetKey.current = resetKey;
    clearToken();
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [clearToken, resetKey]);

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [renderWidget]);

  if (!siteKey) {
    return (
      <p
        role="alert"
        className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm"
      >
        La verificación de seguridad no está configurada.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderWidget}
        onReady={renderWidget}
      />
      <div ref={containerRef} className="min-h-16 w-full" />
      <input type="hidden" name="turnstileToken" value={token} />
      {hasError ? (
        <p role="alert" className="text-destructive text-sm">
          No fue posible completar la verificación. Inténtalo nuevamente.
        </p>
      ) : null}
    </div>
  );
}
