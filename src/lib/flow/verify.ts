// src/lib/flow/verify.ts
import crypto from "crypto";

export function flowVerifySignature(
  params: Record<string, string | number>,
  signature: string,
  secret = process.env.FLOW_SECRET_KEY
): boolean {
  if (!secret) throw new Error("Missing env var: FLOW_SECRET_KEY");

  const ordered = Object.keys(params)
    .filter((k) => k !== "s")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const expected = crypto.createHmac("sha256", secret).update(ordered).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
