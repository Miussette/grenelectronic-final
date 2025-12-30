import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAdminToken } from "@/lib/adminAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie?.split(";").map((s) => s.trim()).find((s) => s.startsWith("admin_session="));
  const token = cookie ? cookie.split("=")[1] : undefined;
  const payload = verifyAdminToken(token);
  if (!payload) return res.status(401).json({ ok: false, error: "Unauthorized" });
  return res.status(200).json({ ok: true, user: { name: payload.user, iat: payload.iat } });
}
