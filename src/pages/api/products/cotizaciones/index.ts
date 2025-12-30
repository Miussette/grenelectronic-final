import type { NextApiRequest, NextApiResponse } from "next";

async function sendEmailFallback(body: any) {
  // Send via SMTP if configured
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const admin = process.env.ADMIN_EMAIL;
  if (!host || !port || !user || !pass || !admin) {
    throw new Error('SMTP not configured');
  }
  // import nodemailer lazily to avoid conditional dependency at runtime if not used
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({ host, port, auth: { user, pass }, secure: port === 465 });
  const text = JSON.stringify(body, null, 2);
  await transporter.sendMail({ from: user, to: admin, subject: `Nueva cotización - ${body.email || 'sin email'}`, text });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const data = req.body; // { name, email, phone, projectType, budget, details, productId?, productName? }
  // Try to persist to disk (dev / self-hosted). In serverless (Vercel) this will fail; fallback to email.
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
    console.error("Error guardando cotización en disco (production probablemente read-only):", e);
    // Try email fallback
    try {
      await sendEmailFallback({ createdAt: new Date().toISOString(), ...data });
      console.log('Cotización enviada por email al administrador');
      return res.status(200).json({ ok: true, fallback: 'email' });
    } catch (ee) {
      console.error('Error en fallback (email):', ee);
      return res.status(500).json({ error: 'Error interno' });
    }
  }
}
