import "server-only";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";

const developmentSiteKey = "1x00000000000000000000AA";
const developmentSecretKey = "1x0000000000000000000000000000000AA";
const siteverifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type SiteverifyResponse = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export type TurnstileVerification =
  | { success: true }
  | { success: false; reason: "configuration" | "invalid" | "unavailable" };

export function getTurnstileSiteKey() {
  if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  }
  return process.env.NODE_ENV === "development" ? developmentSiteKey : null;
}

function getTurnstileSecretKey() {
  if (process.env.TURNSTILE_SECRET_KEY) return process.env.TURNSTILE_SECRET_KEY;
  return process.env.NODE_ENV === "development" ? developmentSecretKey : null;
}

export async function verifyTurnstileToken(
  token: string,
  expectedAction: string,
): Promise<TurnstileVerification> {
  const secret = getTurnstileSecretKey();
  if (!secret) return { success: false, reason: "configuration" };
  if (!token || token.length > 2048) {
    return { success: false, reason: "invalid" };
  }

  const requestHeaders = await headers();
  const requestHost = (
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  )
    ?.split(",")[0]
    .trim()
    .split(":")[0];
  const remoteIp =
    requestHeaders.get("cf-connecting-ip") ??
    requestHeaders.get("x-real-ip") ??
    undefined;

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  body.set("idempotency_key", randomUUID());
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(siteverifyUrl, {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return { success: false, reason: "unavailable" };

    const result = (await response.json()) as SiteverifyResponse;
    if (!result.success) return { success: false, reason: "invalid" };

    const isProduction = process.env.NODE_ENV === "production";
    if (
      isProduction &&
      (result.action !== expectedAction ||
        !requestHost ||
        result.hostname !== requestHost)
    ) {
      return { success: false, reason: "invalid" };
    }

    return { success: true };
  } catch {
    return { success: false, reason: "unavailable" };
  }
}
