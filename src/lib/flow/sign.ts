// src/lib/flow/sign.ts
import crypto from "crypto";

export function flowSign(params: Record<string, string | number>): string {
  const secret = process.env.FLOW_SECRET_KEY;
  if (!secret) throw new Error("Missing env var: FLOW_SECRET_KEY");

  // 1) Ordena keys alfabéticamente
  const ordered = Object.keys(params)
    .filter((k) => k !== "s")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  // 2) HMAC-SHA256 en hex
  return crypto.createHmac("sha256", secret).update(ordered).digest("hex");
}
