# Integración con Supabase

Clientes y utilidades para acceder a Supabase desde navegador y servidor.

- `browser.ts` se utiliza únicamente desde Client Components.
- `server.ts` se utiliza desde Server Components, Server Actions y Route Handlers.

Ambos clientes usan exclusivamente la URL pública y la publishable key. Nunca se debe importar una clave `secret` o `service_role` en estos módulos.

La actualización preventiva de sesiones mediante Proxy se incorporará junto con la protección de rutas y autenticación.
