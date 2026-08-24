# 02 — Arquitectura y Selección de Tecnologías

## Plataforma Comercial La Virginia

Este documento define la arquitectura tecnológica inicial de la plataforma, el stack seleccionado y la estrategia de costos para el MVP.

El objetivo es construir una solución:

- Fácil de mantener.
- Escalable.
- Adecuada para SEO.
- Segura.
- Compatible con desarrollo asistido por Codex.
- Con costo mensual de infraestructura cercano a **$0 durante la etapa inicial**.

---

## 1. Arquitectura seleccionada

Se utilizará una arquitectura de:

> **Monolito modular**

La aplicación se desarrollará como un único proyecto Next.js organizado internamente por módulos funcionales.

No se utilizarán microservicios durante el MVP.

Conceptualmente:

```text
PLATAFORMA

├── Autenticación
├── Negocios
├── Productos
├── Servicios
├── Categorías
├── Promociones
├── Búsqueda
├── Ubicación
├── Analytics
└── Administración
```

Cada módulo tendrá responsabilidades claras, pero todos formarán parte de una misma aplicación.

Esto permite:

- Desarrollo más rápido.
- Menor complejidad.
- Despliegues sencillos.
- Menor costo.
- Mejor mantenimiento para un equipo pequeño.
- Facilidad para trabajar con Codex.

---

## 2. Arquitectura general

```text
                    ┌──────────────────┐
                    │     Usuario      │
                    └────────┬─────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │         Next.js          │
              │ React + TypeScript       │
              │ Frontend + Server        │
              └────────────┬─────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │   Supabase    │
                   └───────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌───────────┐    ┌───────────┐    ┌──────────┐
    │PostgreSQL │    │   Auth    │    │ Storage  │
    └─────┬─────┘    └───────────┘    └──────────┘
          │
          ▼
    ┌─────────────┐
    │ RLS / RPC / │
    │Edge Functions│
    └─────────────┘
```

Servicios adicionales:

```text
Next.js
├── Leaflet
├── OpenStreetMap
├── Cloudflare Turnstile
└── Vercel / hosting compatible
```

---

## 3. Stack tecnológico seleccionado

| Área | Tecnología |
|---|---|
| Framework | **Next.js** |
| UI | **React + TypeScript** |
| CSS | **Tailwind CSS** |
| Componentes | **shadcn/ui** |
| Backend | **Supabase** |
| Base de datos | **PostgreSQL** |
| Auth | **Supabase Auth** |
| Autorización | **Supabase RLS** |
| Storage | **Supabase Storage** |
| Mapas | **Leaflet + OpenStreetMap** |
| Búsqueda | **PostgreSQL Full Text Search** |
| Anti-bot | **Cloudflare Turnstile** |
| Hosting | **Vercel o proveedor compatible con Next.js** |
| Repositorio | **GitHub** |
| Arquitectura | **Monolito modular** |

---

## 4. Next.js

Next.js será el framework principal del proyecto.

No reemplaza React.

Next.js utiliza:

- React.
- TypeScript.
- JavaScript.
- HTML.
- CSS.

En este proyecto reemplaza principalmente el papel que tendría:

- Vite.
- React Router.
- Parte de la lógica de servidor.
- Parte de la infraestructura necesaria para SEO.

Next.js permitirá:

- Routing basado en archivos.
- Renderizado del lado del servidor.
- Server Components.
- Client Components.
- Metadata dinámica.
- Optimización SEO.
- Optimización de imágenes.
- Route Handlers.
- Server Actions cuando sean necesarias.
- Generación de páginas públicas indexables.

Ejemplo de rutas:

```text
/
├── negocios
│   └── [slug]
├── categorias
│   └── [slug]
├── promociones
├── dashboard
└── admin
```

Esto generará URLs como:

```text
/negocios/dulce-maria
/categorias/restaurantes
/promociones
/dashboard
/admin
```

---

## 5. SEO

El SEO será una característica importante del proyecto.

Cada negocio deberá tener una página pública indexable.

Ejemplo:

```text
plataforma.com/negocios/barberia-stiven
```

Esta página podrá generar metadata dinámica como:

```text
Título:
Barbería Stiven | Barberías en La Virginia, Risaralda

Descripción:
Barbería ubicada en La Virginia. Consulta horarios, servicios,
ubicación y contacto por WhatsApp.
```

También deberán configurarse metadatos para compartir enlaces en:

- WhatsApp.
- Facebook.
- LinkedIn.
- Otras redes sociales.

---

## 6. React + TypeScript

React se utilizará para construir la interfaz.

TypeScript será el lenguaje principal.

Se utilizará para:

- Componentes.
- Formularios.
- Estados.
- Hooks.
- Tipado de datos.
- Integración con Supabase.
- Validaciones.
- Interfaces de negocio.

Se deberá mantener TypeScript estricto cuando sea razonable.

---

## 7. Tailwind CSS

Tailwind CSS será utilizado para desarrollar la interfaz responsive.

Ventajas:

- Desarrollo rápido.
- Consistencia visual.
- Buen soporte responsive.
- Fácil integración con Next.js.
- Adecuado para trabajo asistido por Codex.

---

## 8. shadcn/ui

Se utilizará como base para componentes reutilizables.

Ejemplos:

- Dialogs.
- Modals.
- Inputs.
- Selects.
- Dropdowns.
- Tabs.
- Toasts.
- Formularios.
- Menús.

No deberá condicionar completamente el diseño visual de la plataforma.

Los componentes podrán personalizarse según la identidad del proyecto.

---

## 9. Supabase

Supabase será el principal servicio backend.

Permitirá gestionar:

- PostgreSQL.
- Autenticación.
- Storage.
- RLS.
- RPC.
- Edge Functions cuando sean necesarias.

Inicialmente no se desarrollará un backend independiente con:

- Express.
- NestJS.
- Laravel.
- Django.
- Otro servidor dedicado.

La lógica deberá distribuirse entre:

```text
Next.js
+
Supabase
+
PostgreSQL
```

---

## 10. PostgreSQL

PostgreSQL será la base de datos relacional.

El modelo inicial probablemente incluirá entidades como:

```text
users
businesses
business_owners
categories
business_categories
products
services
promotions
business_hours
business_images
business_metrics
```

El esquema definitivo deberá diseñarse antes de comenzar las funcionalidades principales.

---

## 11. Autenticación

Se utilizará:

> **Supabase Auth**

Solo necesitarán autenticación:

- Propietarios de negocios.
- Administradores.

Los visitantes podrán utilizar las funcionalidades públicas sin crear cuenta.

---

## 12. Autorización

La autorización deberá aplicarse utilizando:

> **Supabase Row Level Security (RLS)**

Reglas conceptuales:

```text
Visitante
  ↓
Puede leer negocios publicados

Propietario
  ↓
Puede administrar únicamente los negocios asociados a su cuenta

Administrador
  ↓
Puede administrar los recursos autorizados por su rol
```

No se debe depender únicamente de validaciones del frontend.

---

## 13. Storage

Las imágenes se almacenarán mediante:

> **Supabase Storage**

Posibles buckets:

```text
business-logos
business-images
products
promotions
```

Las imágenes deberán optimizarse antes de almacenarse.

Se deberá controlar:

- Formato.
- Peso.
- Dimensiones.
- Número máximo de archivos.
- Tipo MIME.
- Permisos de acceso.

---

## 14. Optimización de imágenes

El almacenamiento gratuito será uno de los recursos que más cuidado requerirá.

No se deberán almacenar fotografías originales de varios megabytes si no es necesario.

Antes de guardar imágenes se deberá:

- Redimensionar.
- Comprimir.
- Convertir a formatos eficientes cuando corresponda.
- Limitar resolución máxima.
- Limitar tamaño máximo.
- Eliminar archivos reemplazados cuando sea seguro hacerlo.

Next.js podrá utilizar su componente `Image` para mejorar la entrega de imágenes en la interfaz.

---

## 15. Mapas

Se utilizará:

```text
Leaflet
+
OpenStreetMap
```

Leaflet será responsable de:

- Renderizado del mapa.
- Marcadores.
- Interacciones.
- Selección de ubicación.

OpenStreetMap proporcionará la información cartográfica.

Leaflet deberá ejecutarse como Client Component cuando sea necesario.

---

## 16. Geolocalización

La ubicación del visitante podrá obtenerse mediante la API del navegador:

```javascript
navigator.geolocation
```

Siempre deberá solicitarse autorización.

La plataforma deberá seguir funcionando si el usuario decide no compartir su ubicación.

---

## 17. OpenStreetMap

Los datos de OpenStreetMap son abiertos.

Sin embargo, los servidores públicos de tiles:

- Tienen capacidad limitada.
- No ofrecen SLA.
- Tienen políticas de uso.
- No deben utilizarse para descargas masivas.

Durante el MVP podrán utilizarse respetando:

- Atribución.
- Política de tiles.
- Caché.
- Uso razonable.

Si el tráfico aumenta, deberá evaluarse un proveedor dedicado de mapas basado en OpenStreetMap.

---

## 18. Búsqueda

Para el MVP se utilizará:

> **PostgreSQL Full Text Search**

La búsqueda deberá cubrir inicialmente:

- Nombre del negocio.
- Descripción.
- Productos.
- Servicios.
- Categorías.

Ejemplos:

```text
"tortas"
"celulares"
"barbería"
"fotografía"
```

No se utilizarán inicialmente:

- Elasticsearch.
- Algolia.
- Meilisearch.
- Motores vectoriales.

Solo deberán incorporarse si los requerimientos reales lo justifican.

---

## 19. Búsqueda inteligente futura

En versiones posteriores se podrá incorporar búsqueda semántica o IA.

Ejemplo:

```text
Usuario:
"necesito arreglar mi celular"
```

Interpretación:

```text
Categoría: Tecnología
Servicio: Reparación de celulares
Ubicación: La Virginia
```

Esta funcionalidad no pertenece al MVP.

---

## 20. WhatsApp

Inicialmente no se utilizará WhatsApp Business API.

Se usarán enlaces directos:

```text
https://wa.me/57XXXXXXXXXX
```

Podrán incluir mensajes predefinidos.

Ejemplo:

```text
Hola, encontré su negocio en la plataforma y quisiera recibir información sobre...
```

---

## 21. Analytics propios

La plataforma deberá registrar eventos propios para demostrar el valor generado a los negocios.

Ejemplo de tabla:

```text
business_events
```

Campos conceptuales:

```text
id
business_id
event_type
created_at
```

Tipos de evento:

```text
profile_view
whatsapp_click
location_click
instagram_click
product_view
promotion_view
```

Esto permitirá generar estadísticas como:

> Este mes su negocio recibió 436 visitas y 67 personas hicieron clic en WhatsApp.

---

## 22. Cloudflare Turnstile

Se utilizará para proteger formularios frente a:

- Bots.
- Spam.
- Registros automatizados.
- Abuso.

Podrá utilizarse en:

- Registro.
- Recuperación de cuenta.
- Registro de negocio.
- Formularios públicos sensibles.

Durante el MVP el plan gratuito será suficiente.

---

## 23. Hosting

El hosting preferente será:

> **Vercel**

Debido a su integración con Next.js.

Sin embargo, el proyecto deberá mantenerse portable.

No se deberán introducir dependencias innecesarias que hagan imposible migrar a otro hosting compatible con Next.js.

---

## 24. Consideración sobre Vercel Hobby

Vercel Hobby puede utilizarse para:

- Desarrollo.
- Pruebas.
- Prototipos.
- Validación cuando el uso sea compatible con sus términos.

Debe tenerse en cuenta que el plan Hobby está orientado a usos personales o no comerciales.

Si la plataforma comienza a:

- Cobrar membresías.
- Cobrar publicidad.
- Vender posiciones destacadas.
- Generar ingresos.

Se deberá revisar el plan de hosting.

Opciones:

```text
1. Migrar a Vercel Pro.
2. Cambiar a otro proveedor compatible con Next.js.
```

La arquitectura deberá permitir cualquiera de las dos opciones.

---

## 25. GitHub

GitHub será utilizado para:

- Repositorio.
- Control de versiones.
- Pull Requests.
- Revisión de cambios.
- Historial.
- Integración con Codex.
- Despliegues.

Los commits deberán seguir:

```text
03_GUIA_COMMITS.md
```

---

## 26. Entornos

Inicialmente deberán existir:

```text
Development
Production
```

Idealmente también:

```text
Preview
```

Quedando:

```text
Development
Preview
Production
```

Las variables de entorno deberán mantenerse separadas cuando corresponda.

---

## 27. Variables de entorno

Nunca se deberán guardar secretos directamente en el repositorio.

Se utilizarán archivos como:

```text
.env.local
.env.example
```

El archivo `.env.example` únicamente deberá contener nombres de variables y ejemplos seguros.

Nunca publicar:

- Supabase service role key.
- Secret keys.
- Contraseñas.
- Tokens personales.
- Secretos de Turnstile.
- Credenciales administrativas.
- Claves privadas.

---

## 28. Costos iniciales

El objetivo será comenzar pagando únicamente el dominio.

| Servicio | Costo inicial estimado |
|---|---:|
| Next.js | $0 |
| React | $0 |
| TypeScript | $0 |
| Tailwind CSS | $0 |
| shadcn/ui | $0 |
| Supabase Free | $0 |
| Leaflet | $0 |
| OpenStreetMap | $0 para uso razonable del MVP |
| Cloudflare Turnstile | $0 |
| GitHub | $0 |
| Vercel Hobby | $0 cuando el uso sea compatible |
| Dominio | Variable |

---

## 29. Supabase Free

El plan gratuito de Supabase será suficiente para comenzar.

Los límites deberán verificarse periódicamente porque pueden cambiar.

Como referencia para la etapa inicial, se deberá vigilar principalmente:

- Tamaño de PostgreSQL.
- Storage.
- Egress.
- Usuarios activos.
- Edge Function invocations.

El recurso que probablemente se agotará primero será:

> **Storage / tráfico de imágenes**

Por esta razón, la optimización de fotografías será obligatoria.

---

## 30. Estrategia de costos

### Etapa 1 — Desarrollo

```text
Next.js               $0
Supabase               $0
Cloudflare Turnstile   $0
Leaflet                $0
OpenStreetMap          $0
GitHub                 $0
Hosting                $0

Dominio                opcional durante desarrollo
```

### Etapa 2 — MVP

```text
Infraestructura        ≈ $0/mes
Dominio                principal gasto
```

### Etapa 3 — Tracción inicial

Solo se pagarán servicios cuando:

- Se alcance un límite real.
- El proyecto genere ingresos.
- Sea necesario por términos de uso.
- Exista una mejora técnica justificable.

Posibles primeros costos:

```text
Hosting comercial
Supabase Pro
Proveedor de mapas
Mayor almacenamiento
CDN
Servicios de correo
```

---

## 31. Reglas para mantener costos bajos

- Optimizar imágenes antes de subirlas.
- Limitar cantidad de imágenes por negocio.
- No guardar archivos innecesarios.
- Evitar servicios externos si PostgreSQL puede resolver el problema.
- No implementar microservicios.
- No utilizar Redis durante el MVP.
- No utilizar Elasticsearch durante el MVP.
- No utilizar colas de mensajes sin necesidad.
- No contratar infraestructura anticipadamente.
- Monitorizar consumo de Supabase.
- Mantener Next.js portable entre proveedores de hosting.

---

## 32. Tecnologías que NO se utilizarán inicialmente

No incorporar durante el MVP salvo requerimiento justificado:

```text
Microservicios
Docker en producción
Kubernetes
Redis
Elasticsearch
Algolia
NestJS
Express como backend separado
API Gateway
Kafka
RabbitMQ
AWS S3
Inteligencia Artificial obligatoria
```

La regla será:

> No agregar una tecnología porque sea popular. Agregarla únicamente cuando resuelva un problema real del proyecto.

---

## 33. Estructura inicial sugerida

```text
src/
├── app/
│   ├── negocios/
│   ├── categorias/
│   ├── promociones/
│   ├── dashboard/
│   └── admin/
│
├── components/
│   ├── business/
│   ├── search/
│   ├── maps/
│   ├── forms/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   ├── analytics/
│   └── utils/
│
├── services/
├── types/
└── config/

supabase/
├── migrations/
└── functions/

docs/
├── 01_LEVANTAMIENTO_REQUERIMIENTOS.md
├── 02_ARQUITECTURA_Y_TECNOLOGIAS.md
├── 03_GUIA_COMMITS.md
└── 04_CHECKLIST_IMPLEMENTACION.md
```

Esta estructura podrá ajustarse a medida que Codex y el equipo identifiquen mejores divisiones.

---

## 34. Principios de desarrollo

El proyecto deberá seguir estos principios:

### Simplicidad

Construir primero la solución más sencilla que cumpla el requerimiento.

### Seguridad

La autorización debe protegerse mediante RLS y lógica del servidor, no únicamente desde la interfaz.

### Modularidad

Separar responsabilidades sin convertir prematuramente el sistema en microservicios.

### SEO

Las páginas públicas deberán diseñarse pensando en indexación desde el inicio.

### Mobile First

La plataforma deberá priorizar dispositivos móviles.

### Costos

Evitar cualquier dependencia paga mientras no exista una necesidad real.

### Escalabilidad razonable

Preparar el sistema para crecer sin diseñar infraestructura para millones de usuarios antes de tenerlos.

---

## 35. Criterios para Codex

Codex deberá utilizar este documento como referencia tecnológica.

Durante el desarrollo deberá:

- Utilizar Next.js como framework principal.
- Utilizar TypeScript.
- Seguir App Router.
- Diferenciar correctamente Server Components y Client Components.
- Evitar marcar componentes como `"use client"` si no es necesario.
- Mantener lógica sensible en servidor o Supabase.
- Aplicar RLS.
- Evitar secretos en frontend.
- Mantener SEO en páginas públicas.
- Optimizar imágenes.
- Mantener componentes reutilizables.
- No agregar dependencias innecesarias.
- No cambiar el stack sin documentar la razón.
- Mantener compatibilidad con hosting alternativo a Vercel.
- Seguir la convención definida en `03_GUIA_COMMITS.md`.

---

## 36. Decisiones técnicas aprobadas

```text
Framework:
Next.js

Lenguaje:
TypeScript

UI:
React

Estilos:
Tailwind CSS

Componentes:
shadcn/ui

Backend:
Supabase

Base de datos:
PostgreSQL

Autenticación:
Supabase Auth

Autorización:
Supabase RLS

Storage:
Supabase Storage

Mapas:
Leaflet + OpenStreetMap

Búsqueda:
PostgreSQL Full Text Search

Anti-bot:
Cloudflare Turnstile

Hosting:
Vercel inicialmente / hosting compatible si es necesario

Repositorio:
GitHub

Arquitectura:
Monolito modular
```

---

## 37. Próximo documento

El siguiente documento será:

```text
04_CHECKLIST_IMPLEMENTACION.md
```

Este documento deberá convertir:

```text
Requerimientos
+
Arquitectura
```

en una secuencia ordenada de tareas.

Cada tarea deberá poder marcarse como:

```markdown
- [ ] Pendiente
- [x] Completada
```

El objetivo será utilizar este checklist como guía principal durante el desarrollo con Codex.
