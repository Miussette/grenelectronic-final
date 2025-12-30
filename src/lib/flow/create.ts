// src/lib/flow/create.ts
import { flowSign } from "./sign";

function envOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

type CreateResult = { paymentUrl: string; token: string; flowOrder?: number };

export async function createFlowPayment(opts: {
  orderId: string;
  total: number;
  email: string;
  subject?: string;
  currency?: string;
  appBaseUrl?: string; // optional override
}): Promise<CreateResult> {
  const { orderId, total, email, subject = "Compra", currency = "CLP", appBaseUrl } = opts;

  const FLOW_API_KEY = envOrThrow("FLOW_API_KEY");
  const FLOW_BASE_URL = envOrThrow("FLOW_BASE_URL");
  const APP_BASE_URL = appBaseUrl ?? envOrThrow("APP_BASE_URL");

  const params: Record<string, string | number> = {
    apiKey: FLOW_API_KEY,
    commerceOrder: orderId,
    subject,
    currency,
    amount: Math.round(Number(total)),
    email,
    urlConfirmation: `${APP_BASE_URL}/api/payments/flow/confirmation`,
    urlReturn: `${APP_BASE_URL}/api/payments/flow/return`,
  };
  // Log useful info (no secrets)
  try {
    const safeLog = { commerceOrder: params.commerceOrder, amount: params.amount, currency: params.currency, email: params.email, urlConfirmation: params.urlConfirmation, urlReturn: params.urlReturn, flowBaseUrl: FLOW_BASE_URL };
    console.info("[flow/create] creating payment", safeLog);

    const s = flowSign(params);

    const body = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) body.append(k, String(v));
    body.append("s", s);

    const resp = await fetch(`${FLOW_BASE_URL}/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const respText = await resp.text();
    if (!resp.ok) {
      console.error("[flow/create] Flow responded with non-ok status", { status: resp.status, body: respText });
      throw new Error(`Flow create failed: ${respText}`);
    }

    let data: any;
    try {
      data = JSON.parse(respText);
    } catch (parseErr) {
      console.error("[flow/create] failed to parse JSON response", { respText, parseErr });
      throw new Error(`Invalid JSON from Flow: ${respText}`);
    }

    const token = String(data.token ?? "");
    const obfuscatedToken = token ? `${token.slice(0, 6)}...${token.slice(-4)}` : "";
    console.info("[flow/create] Flow create succeeded", { flowOrder: data.flowOrder, token: obfuscatedToken, url: data.url });

    const paymentUrl = `${data.url}?token=${data.token}`;
    return { paymentUrl, token: data.token, flowOrder: data.flowOrder };
  } catch (err) {
    console.error("[flow/create] error creating payment", err instanceof Error ? err.message : err);
    throw err;
  }
}
