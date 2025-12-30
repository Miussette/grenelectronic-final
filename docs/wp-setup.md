# WP / WooCommerce setup for builds

This project needs access to your WordPress/WooCommerce site during `next build` (SSG prerender). Provide the following env vars before running `npm run build`.

Required env vars

- `NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT` — full URL to WP GraphQL endpoint (e.g. `https://example.com/graphql`).
- `NEXT_PUBLIC_WC_BASE` — base URL of your WP site (no trailing slash), used to call WooCommerce REST (e.g. `https://example.com`).
- `WC_KEY` and `WC_SECRET` — Consumer Key and Secret for WooCommerce REST API with read access.
- `APP_BASE_URL` — Public URL of your app (used for building absolute links). For local builds, `http://localhost:3000` is fine.

Optional

- `NEXT_PUBLIC_USE_MOCK_WP` / `BUILD_USE_MOCK_WP` — set to `1` to use the local mock endpoint `/api/_mock/wp` during build if the real WP is unreachable.

Cotizaciones fallback (production)

When running on serverless platforms (Vercel, etc.) the filesystem is read-only and the app cannot persist cotizaciones to `data/cotizaciones.json`. The app will try to write locally first; if that fails you can configure an SMTP fallback to email new cotizaciones to an administrator.

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — SMTP credentials
- `ADMIN_EMAIL` — destination for cotizaciones emails

If SMTP isn't configured and the server can't write to disk, submissions will fail with an internal error. For production it's recommended to either provide SMTP settings or replace the file persistence with a DB or an external API.

Local (Windows PowerShell)

Copy `.env.example` to `.env.local` and edit values, then run:

```powershell
Set-Content -Path .env.local -Value (Get-Content .env.example -Raw)
# Edit .env.local with your values (use an editor)
npm run build
```

CI (GitHub Actions)

Add repository secrets in GitHub: `NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT`, `NEXT_PUBLIC_WC_BASE`, `WC_KEY`, `WC_SECRET`, `APP_BASE_URL`.

Example `workflow.yml` snippet:

```yaml
env:
  NODE_ENV: production

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install
        run: npm ci
      - name: Build
        env:
          NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT: ${{ secrets.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT }}
          NEXT_PUBLIC_WC_BASE: ${{ secrets.NEXT_PUBLIC_WC_BASE }}
          WC_KEY: ${{ secrets.WC_KEY }}
          WC_SECRET: ${{ secrets.WC_SECRET }}
          APP_BASE_URL: ${{ secrets.APP_BASE_URL }}
        run: npm run build
```

If your WP server blocks the CI runner's IPs, consider allowing GitHub Actions IP ranges or use a private network / preview environment that can reach your WP site.
