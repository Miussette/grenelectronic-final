import type { NextApiRequest, NextApiResponse } from "next";

type CartItem = {
  id: number; // WooCommerce espera number
  name: string;
  price: number;
  qty: number;
};

type Billing = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  codigoPostal: string;
  notas?: string;
};

type CreateOrderBody = {
  items: CartItem[];
  billing: Billing;
  paymentMethod: "flow" | "transferencia" | "bacs" | string;
};

type WooOrderResponse = {
  id: number;
  number: string | number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, billing, paymentMethod } = req.body as CreateOrderBody;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    // Validación mínima de billing (para evitar undefined)
    if (!billing?.nombre || !billing?.apellido || !billing?.email) {
      return res.status(400).json({ error: "Datos de facturación incompletos" });
    }

    const WC_BASE = process.env.NEXT_PUBLIC_WC_BASE;
    const WC_KEY = process.env.WC_KEY;
    const WC_SECRET = process.env.WC_SECRET;

    if (!WC_BASE || !WC_KEY || !WC_SECRET) {
      return res.status(500).json({ error: "Configuración de WooCommerce incompleta" });
    }

    // Determinar método de pago
    const isFlow = paymentMethod === "flow";
    const paymentMethodCode = isFlow ? "flow" : "bacs";
    const paymentMethodTitle = isFlow ? "Flow" : "Transferencia Bancaria";

    const orderData = {
      payment_method: paymentMethodCode,
      payment_method_title: paymentMethodTitle,
      set_paid: false,
      billing: {
        first_name: billing.nombre,
        last_name: billing.apellido,
        email: billing.email,
        phone: billing.telefono,
        address_1: billing.direccion,
        city: billing.ciudad,
        state: billing.region,
        postcode: billing.codigoPostal,
        country: "CL",
      },
      customer_note: billing.notas ?? "",
      line_items: items.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
      })),
    };

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

    console.info("[api/woocommerce/create-order] creating order in WooCommerce", { itemsCount: items.length, paymentMethod, customerEmail: billing.email });

    const response = await fetch(`${WC_BASE}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de WooCommerce:", errorText);
      return res.status(response.status).json({ error: "Error al crear la orden en WooCommerce" });
    }

    const order = (await response.json()) as WooOrderResponse;
    console.info("[api/woocommerce/create-order] WooCommerce order created", { id: order.id, number: order.number });

    // Si es Flow, generar URL de pago
    let flowUrl: string | null = null;

    if (isFlow) {
      try {
        // Calcular total con IVA (19%)
        const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const total = Math.round(subtotal * 1.19);

        console.info("[api/woocommerce/create-order] creating Flow payment", { orderId: order.id, total, email: billing.email });

        // Llamamos a Flow directamente desde el servidor (sin pasar por HTTP interno)
        const { createFlowPayment } = await import("@/lib/flow/create");
        try {
          const flowResult = await createFlowPayment({
            orderId: String(order.id),
            total,
            email: billing.email,
            subject: `Orden #${order.number} - Grenelectronic`,
          });
          flowUrl = flowResult.paymentUrl;
          console.info("[api/woocommerce/create-order] Flow payment created", { orderId: order.id, paymentUrl: flowUrl ? "(omitted)" : null, token: flowResult.token ? String(flowResult.token).slice(0, 6) : undefined });
        } catch (flowErr) {
          console.error("[api/woocommerce/create-order] Flow error", flowErr instanceof Error ? flowErr.message : flowErr);
        }
      } catch (flowError: unknown) {
        console.error("Error al crear pago Flow:", flowError);
        // Continuar sin Flow, la orden ya está creada
      }
    }

    return res.status(200).json({
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      flowUrl,
    });
  } catch (error: unknown) {
    console.error("Error en create-order:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
