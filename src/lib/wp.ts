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
    // If a build-time mock is enabled, attempt to use a local mock endpoint
    const useMock = process.env.BUILD_USE_MOCK_WP === '1' || process.env.BUILD_USE_MOCK_WP === 'true' || process.env.NEXT_PUBLIC_USE_MOCK_WP === '1';
    if (useMock) {
      try {
        const mockResp = await fetch(process.env.APP_BASE_URL ? `${process.env.APP_BASE_URL.replace(/\/$/, '')}/api/_mock/wp` : '/api/_mock/wp', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables })
        });
        if (mockResp.ok) {
          const mj = await mockResp.json();
          return mj.data as T;
        }
      } catch (e) {
        console.error('Error fetching mock wp endpoint', e);
      }
    }

    // As a last resort, return an empty object to allow prerendering to continue.
    return {} as unknown as T;
  }
}
