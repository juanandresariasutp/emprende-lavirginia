# Configuración de Cloudflare Turnstile

La aplicación protege el registro de propietarios mediante un widget Turnstile y valida cada token en el servidor con Siteverify.

## Producción

1. En Cloudflare, abre **Turnstile** y crea un widget administrado para el dominio de producción.
2. Agrega el dominio público en la lista de hostnames permitidos. No agregues `localhost` al widget de producción.
3. Configura la site key durante el build:

   ```env
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=
   ```

4. Configura la clave secreta únicamente en el entorno del servidor:

   ```env
   TURNSTILE_SECRET_KEY=
   ```

5. Vuelve a desplegar la aplicación y comprueba un registro real.

La clave secreta nunca debe comenzar por `NEXT_PUBLIC_`, enviarse al navegador ni guardarse en Git.

## Desarrollo local

Cuando las variables no están definidas y `NODE_ENV=development`, la aplicación utiliza las claves de prueba oficiales de Cloudflare. Estas claves funcionan en `localhost`, generan un widget visible y siempre aprueban tokens de prueba válidos.

En producción no existe ningún valor por defecto: si faltan las claves, el registro queda bloqueado y muestra un error de configuración.

## Validación aplicada

El servidor comprueba:

- que el token exista y no supere 2048 caracteres;
- la respuesta de `https://challenges.cloudflare.com/turnstile/v0/siteverify`;
- la acción esperada (`register`);
- el hostname de la petición en producción;
- el vencimiento y la reutilización, gestionados por Cloudflare;
- un tiempo máximo de ocho segundos para evitar solicitudes bloqueadas.
