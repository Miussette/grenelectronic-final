// src/pages/api/payments/flow/confirmation.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { flowVerifySignature } from "@/lib/flow/verify";

type Ok = "OK";
type Err = { error: string };

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    // Para x-www-form-urlencoded, Next suele parsearlo a objeto:
    const body = req.body as Record<string, string>;

    const { s, ...rest } = body;
    if (!s) return res.status(400).json({ error: "Missing signature" });

    // Verifica firma
    const ok = flowVerifySignature(rest, s);
    if (!ok) return res.status(401).json({ error: "Invalid signature" });

    // Datos relevantes
    const token = body.token;
    const flowOrder = Number(body.flowOrder);
    const commerceOrder = body.commerceOrder;
    const status = Number(body.status);

    if (!token || !flowOrder || !commerceOrder) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // TODO: actualizar orden en tu DB:
    // - status 2 => pagado
    // - status 1 => pendiente
    // - status 3/4 => fallido/anulado
    //
    // await updateOrderInDB({ commerceOrder, flowOrder, status, token })

    // Respuesta que Flow espera
    return res.status(200).send("OK");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Confirmation error";
    console.error("[flow/confirmation] ", msg);
    return res.status(500).json({ error: msg });
  }
}
