import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const data = req.body; // { name, email, phone, projectType, budget, details, productId?, productName? }
  // Guardar en JSON local para que el admin pueda revisarlas
  try {
    const path = require("path");
    const fs = require("fs");
    const p = path.resolve(process.cwd(), "data", "cotizaciones.json");
    const list = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : [];
    const item = { id: Date.now(), createdAt: new Date().toISOString(), ...data };
    list.push(item);
    fs.writeFileSync(p, JSON.stringify(list, null, 2), "utf8");
    console.log("Nueva cotización guardada:", { id: item.id, email: data.email });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Error guardando cotización:", e);
    return res.status(500).json({ error: "Error interno" });
  }
}
