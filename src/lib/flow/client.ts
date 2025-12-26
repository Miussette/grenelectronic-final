// src/lib/flow/client.ts
import { flowSign } from "./sign";

export type FlowStatusResponse = {
  status: number;         // 1=pendiente, 2=pago realizado, 3=fallido, 4=anulado, etc.
  flowOrder: number;
  commerceOrder: string;
  amount: number;
  currency: string;
  email: string;
  subject: string;
  date: string;
};

function envOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function flowGetStatus(token: string): Promise<FlowStatusResponse> {
  const FLOW_API_KEY = envOrThrow("FLOW_API_KEY");
  const FLOW_BASE_URL = envOrThrow("FLOW_BASE_URL"); // e.g. https://sandbox.flow.cl/api

  const params: Record<string, string> = { apiKey: FLOW_API_KEY, token };
  const s = flowSign(params);

  const body = new URLSearchParams({ ...params, s });

  const resp = await fetch(`${FLOW_BASE_URL}/payment/getStatus`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Flow getStatus failed: ${text}`);
  }

  const data = (await resp.json()) as FlowStatusResponse;
  return data;
}
