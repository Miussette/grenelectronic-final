// src/pages/api/payments/flow/return.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { flowGetStatus } from "@/lib/flow/client";

function envOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  try {
    const APP_BASE_URL = envOrThrow("APP_BASE_URL");
    const token = typeof req.query.token === "string" ? req.query.token : "";

    if (!token) {
      return res.redirect(302, `${APP_BASE_URL}/pago/error?reason=missing_token`);
    }

    // Consulta estado real
    const status = await flowGetStatus(token);
    const orderId = encodeURIComponent(status.commerceOrder);

    // status 2 = pagado
    if (status.status === 2) {
      return res.redirect(302, `${APP_BASE_URL}/pago/exito?orderId=${orderId}`);
    }

    // Otros estados -> error/pending
    return res.redirect(
      302,
      `${APP_BASE_URL}/pago/error?orderId=${orderId}&code=${status.status}`
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Return error";
    console.error("[flow/return] ", msg);

    // Fallback a página de error genérica
    const base = process.env.APP_BASE_URL ?? "/";
    return res.redirect(302, `${base}/pago/error?reason=exception`);
  }
}
