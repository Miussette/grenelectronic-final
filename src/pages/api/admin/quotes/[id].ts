import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { verifyAdminToken } from "@/lib/adminAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie?.split(";").map(s=>s.trim()).find(s=>s.startsWith("admin_session="));
  const token = cookie ? cookie.split("=")[1] : undefined;
  const payload = verifyAdminToken(token);
  if (!payload) return res.status(401).json({ ok: false, error: "Unauthorized" });

  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, error: "Missing id" });
  const nid = Number(id);

  const p = path.resolve(process.cwd(), "data", "cotizaciones.json");
  try {
    const list = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : [];
    const idx = list.findIndex((it: any) => Number(it.id) === nid);
    if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });

    if (req.method === "GET") {
      return res.status(200).json({ ok: true, quote: list[idx] });
    }

    if (req.method === "PUT") {
      const body = req.body ?? {};
      const updated = { ...list[idx], ...body };
      list[idx] = updated;
      fs.writeFileSync(p, JSON.stringify(list, null, 2), "utf8");
      return res.status(200).json({ ok: true, quote: updated });
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (e) {
    console.error("[api/admin/quotes/[id]]", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
