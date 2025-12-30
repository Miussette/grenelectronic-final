import "dotenv/config";
import { runFlowDiagnostic } from "../src/lib/flow/diagnostic";

async function main() {
  try {
    const out = await runFlowDiagnostic();
    console.log("Flow diagnostic result:", JSON.stringify(out, null, 2));
  } catch (e) {
    console.error("Diagnostic failed:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  }
}

main();
