import "dotenv/config";

async function main() {
  try {
    const { createFlowPayment } = await import("../src/lib/flow/create");

    console.log("Llamando a createFlowPayment con datos de prueba...");

    const result = await createFlowPayment({
      orderId: `test-${Date.now()}`,
      total: 1000,
      email: "test@example.com",
      subject: "Prueba Flow - entorno local",
    });

    console.log("Flow create result:", result);
  } catch (e) {
    console.error("Error ejecutando createFlowPayment:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  }
}

main();
