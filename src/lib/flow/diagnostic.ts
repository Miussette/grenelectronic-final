import { flowSign } from "./sign";
import { flowVerifySignature } from "./verify";

export type FlowDiagnosticResult = {
  ok: boolean;
  env: Record<string, boolean>;
  signVerify?: { signed: string; verified: boolean };
  errors?: string[];
};

function envPresent(name: string): boolean {
  return Boolean(process.env[name]);
}

export async function runFlowDiagnostic(): Promise<FlowDiagnosticResult> {
  const required = ["FLOW_API_KEY", "FLOW_SECRET_KEY", "FLOW_BASE_URL", "APP_BASE_URL"];
  const env: Record<string, boolean> = {};
  const errors: string[] = [];

  for (const k of required) {
    env[k] = envPresent(k);
    if (!env[k]) errors.push(`Missing env var: ${k}`);
  }

  const result: FlowDiagnosticResult = { ok: errors.length === 0, env, errors: errors.length ? errors : undefined };

  // If secrets present, test sign/verify flow (no external calls)
  try {
    if (env.FLOW_SECRET_KEY && env.FLOW_API_KEY) {
      const params = { apiKey: process.env.FLOW_API_KEY!, commerceOrder: "diag-order", amount: 12345 } as Record<string, string | number>;
      const s = flowSign(params);
      const verified = flowVerifySignature(params, s, process.env.FLOW_SECRET_KEY);
      // Obfuscate signature for safety
      const obfuscated = `${s.slice(0, 6)}...${s.slice(-6)}`;
      result.signVerify = { signed: obfuscated, verified };
      if (!verified) {
        result.ok = false;
        (result.errors ??= []).push("Signature verification failed");
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    (result.errors ??= []).push(`Sign/verify error: ${msg}`);
    result.ok = false;
  }

  return result;
}
