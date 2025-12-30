import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAdminToken } from "@/lib/adminAuth";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie?.split(";").map(s=>s.trim()).find(s=>s.startsWith("admin_session="));
  const token = cookie ? cookie.split("=")[1] : undefined;
  const payload = verifyAdminToken(token);
  if (!payload) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const p = path.resolve(process.cwd(), "data", "cotizaciones.json");
      const list = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : [];
      return res.status(200).json({ ok: true, quotes: list });
    } catch (e) {
      console.error("[api/admin/quotes]", e);
      return res.status(500).json({ error: "Error interno" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
