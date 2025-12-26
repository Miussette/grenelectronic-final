import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const data = req.body; // { name, email, phone, projectType, budget, details, productId?, productName? }

  // TODO: Conectar a tu almacenamiento real:
  // - Enviar por correo (SendGrid/Resend)
  // - Guardar en DB
  // - Crear issue/ticket
  console.log("Nueva cotización:", data);

  return res.status(200).json({ ok: true });
}
