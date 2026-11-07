# Future NestJS integration

1. Keep the existing Okta authentication, agent authorization, LOB filtering, and APIs.
2. Introduce an optional response adapter that maps existing tool results into the `PluginResult` envelope defined in `frontend/src/app/models.ts`.
3. Validate `schemaVersion`, `responseType`, `data` shapes, allowed actions, and request scope server-side. Never execute HTML/JS from model output.
4. Replace the frontend `MockApiService.ask()` with an authenticated HTTP client to the **actual approved endpoint**. The endpoint is not known from screenshots, so no route is assumed here.
5. Add CORS, CSRF controls as applicable, Okta token handling, error handling, correlation IDs, pagination, and production logging according to company standards.
6. Do not put AWS secrets, Arize keys, Lambda ARNs requiring confidentiality, or Okta client secrets in frontend code.
7. Use backend enforcement for agent/LOB permissions; dropdown selections are never authority.
8. Verify API contracts and existing streaming approach before adding SSE/WebSockets.
