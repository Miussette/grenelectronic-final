import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminToken } from "@/lib/adminAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body ?? {};
  const ADMIN_USER = process.env.ADMIN_USER ?? "Superadmin";
  const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "asdf456789";

  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = createAdminToken(username);
    // Set cookie
    const isProd = process.env.NODE_ENV === "production";
    res.setHeader("Set-Cookie", `admin_session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${isProd ? "; Secure" : ""}`);
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: "Invalid credentials" });
}
