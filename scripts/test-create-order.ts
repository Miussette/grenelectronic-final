import "dotenv/config";
import handler from "../src/pages/api/woocommerce/create-order";

function makeReq(body: any) {
  return { method: "POST", body } as any;
}

function makeRes() {
  let statusCode = 200;
  return {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(obj: any) {
      console.log("[test-create-order] response status:", statusCode);
      console.log("[test-create-order] response body:", JSON.stringify(obj, null, 2));
      return obj;
    },
  } as any;
}

async function main() {
  const mockItems = [
    { id: 1, name: "Producto prueba", price: 1000, qty: 1 },
  ];

  const billing = {
    nombre: "Juan",
    apellido: "Perez",
    email: "cliente+test@greenelectronic.cl",
    telefono: "+56912345678",
    direccion: "Calle Falsa 123",
    ciudad: "Santiago",
    region: "RM",
    codigoPostal: "8330000",
    notas: "",
  };

  const req = makeReq({ items: mockItems, billing, paymentMethod: "flow" });
  const res = makeRes();

  try {
    await handler(req, res);
  } catch (e) {
    console.error("[test-create-order] handler threw:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  }
}

main();
