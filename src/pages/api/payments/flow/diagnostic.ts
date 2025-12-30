import type { NextApiRequest, NextApiResponse } from "next";
import { runFlowDiagnostic } from "@/lib/flow/diagnostic";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const diag = await runFlowDiagnostic();
    return res.status(200).json(diag);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Diagnostic error";
    console.error("[api/payments/flow/diagnostic]", msg);
    return res.status(500).json({ error: msg });
  }
}
