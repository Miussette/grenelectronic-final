export async function wpGql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT;
  
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT no está configurado");
  }

  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache por 60 segundos en Next.js 13+
    });

    if (!r.ok) {
      throw new Error(`HTTP error! status: ${r.status}`);
    }

    const j = await r.json();
    if (j.errors) throw new Error(j.errors?.[0]?.message ?? "GraphQL error");
    return j.data;
  } catch (error) {
    console.error("Error en wpGql:", error);
    throw error;
  }
}
