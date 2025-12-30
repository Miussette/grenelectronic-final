// src/pages/api/payments/flow/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createFlowPayment } from "@/lib/flow/create";

type OkResponse = { paymentUrl: string; token: string };
type ErrResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OkResponse | ErrResponse>
) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { orderId, total, email, subject = "Compra en Grenelectronic", currency = "CLP" } =
      req.body as {
        orderId: string;
        total: number;
        email: string;
        subject?: string;
        currency?: string;
      };

    console.info("[api/payments/flow/create] received request", { orderId, total, email, subject, currency });

    if (!orderId || !Number.isFinite(Number(total)) || !email) {
      console.warn("[api/payments/flow/create] invalid parameters", { orderId, total, email });
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    try {
      const result = await createFlowPayment({ orderId, total, email, subject, currency });
      console.info("[api/payments/flow/create] created flow payment", { orderId, token: String(result.token).slice(0, 6) });
      return res.status(200).json({ paymentUrl: result.paymentUrl, token: result.token });
    } catch (err) {
      console.error("[api/payments/flow/create] createFlowPayment error", err instanceof Error ? err.message : err);
      return res.status(500).json({ error: err instanceof Error ? err.message : "Flow create error" });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Flow create error";
    console.error("[flow/create] ", msg);
    return res.status(500).json({ error: msg });
  }
}
