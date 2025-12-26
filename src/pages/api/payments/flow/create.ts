// src/pages/api/payments/flow/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { flowSign } from "@/lib/flow/sign"; 


type FlowCreateOk = {
  url: string;
  token: string;
  flowOrder: number;
};

type OkResponse = { paymentUrl: string; token: string };
type ErrResponse = { error: string };

// Verifica env vars de forma segura
function getEnvOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OkResponse | ErrResponse>
) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const FLOW_API_KEY = getEnvOrThrow("FLOW_API_KEY");
    const FLOW_BASE_URL = getEnvOrThrow("FLOW_BASE_URL"); // ej: https://sandbox.flow.cl/api
    const APP_BASE_URL  = getEnvOrThrow("APP_BASE_URL");  // ej: https://grenelectronic.cl

    // Valida body
    const { orderId, total, email, subject = "Compra en Grenelectronic", currency = "CLP" } =
      req.body as {
        orderId: string;
        total: number;
        email: string;
        subject?: string;
        currency?: string;
      };

    if (!orderId || !Number.isFinite(Number(total)) || !email) {
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    // Parámetros para payment/create
    const params: Record<string, string | number> = {
      apiKey: FLOW_API_KEY,
      commerceOrder: orderId,
      subject,
      currency,                          // CLP
      amount: Math.round(Number(total)), // CLP enteros
      email,
      urlConfirmation: `${APP_BASE_URL}/api/payments/flow/confirmation`,
      urlReturn: `${APP_BASE_URL}/api/payments/flow/return`,
    };

    // Firma
    const s = flowSign(params);

    // x-www-form-urlencoded
    const body = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) body.append(k, String(v));
    body.append("s", s);

    // Usa fetch nativo (no necesitas node-fetch en Next >=12)
    const resp = await fetch(`${FLOW_BASE_URL}/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Flow create failed: ${text}`);
    }

    const data = (await resp.json()) as FlowCreateOk;

    // Respuesta que espera el frontend
    const paymentUrl = `${data.url}?token=${data.token}`;
    return res.status(200).json({ paymentUrl, token: data.token });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Flow create error";
    console.error("[flow/create] ", msg);
    return res.status(500).json({ error: msg });
  }
}
