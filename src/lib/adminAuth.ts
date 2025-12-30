import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET ?? process.env.SESSION_SECRET ?? "dev-secret-change-me";

type Payload = { user: string; iat: number };

export function createAdminToken(user: string) {
  const payload: Payload = { user, iat: Date.now() };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): Payload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Payload;
    return payload;
  } catch {
    return null;
  }
}
