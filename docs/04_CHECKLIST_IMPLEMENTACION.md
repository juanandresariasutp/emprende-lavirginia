# 04 — Checklist de Implementación

## Plataforma Comercial La Virginia

Este documento será la guía principal para desarrollar la plataforma paso a paso con apoyo de Codex.

Debe utilizarse junto con:

```text
01_LEVANTAMIENTO_REQUERIMIENTOS.md
02_ARQUITECTURA_Y_TECNOLOGIAS.md
03_GUIA_COMMITS.md
```

La regla principal será:

> Cada tarea debe ser pequeña, verificable y terminar con un commit.

---

# 1. Preparación del proyecto

## 1.1 Crear el repositorio

- [x] Crear repositorio en GitHub.
- [x] Definir rama principal `main`.
- [x] Agregar `.gitignore`.
- [x] Agregar carpeta `docs/`.
- [x] Copiar dentro de `docs/`:
  - [x] `01_LEVANTAMIENTO_REQUERIMIENTOS.md`
  - [x] `02_ARQUITECTURA_Y_TECNOLOGIAS.md`
  - [x] `03_GUIA_COMMITS.md`
  - [x] `04_CHECKLIST_IMPLEMENTACION.md`

### Validación

- [x] El repositorio existe.
- [x] Los documentos están versionados.
- [x] No hay secretos publicados.

### Commit

```bash
docs: agregar documentación inicial del proyecto
```

---

## 1.2 Inicializar Next.js

- [x] Crear proyecto con Next.js.
- [x] Activar TypeScript.
- [x] Utilizar App Router.
- [x] Configurar carpeta `src/`.
- [x] Confirmar que el proyecto ejecuta correctamente.

### Validación

Ejecutar:

```bash
npm run dev
```

Comprobar que:

- [x] La aplicación abre localmente.
- [x] No existen errores de compilación.

### Commit

```bash
chore: inicializar proyecto con nextjs y typescript
```

---

## 1.3 Configurar dependencias base

- [x] Instalar Tailwind CSS si no viene configurado.
- [x] Configurar shadcn/ui.
- [x] Instalar Supabase Client.
- [x] Instalar Leaflet.
- [x] Instalar tipos necesarios.
- [ ] Instalar librería de QR cuando se requiera.

### Validación

- [x] El proyecto compila.
- [x] No existen dependencias innecesarias.

### Commit

```bash
build: agregar dependencias base del proyecto
```

---

## 1.4 Configurar ESLint y formato

- [x] Revisar configuración de ESLint.
- [x] Configurar Prettier si se decide utilizar.
- [x] Definir reglas básicas de formato.
- [x] Evitar conflictos entre ESLint y Prettier.

### Validación

Ejecutar:

```bash
npm run lint
```

### Commit

```bash
chore: configurar linting y formato del proyecto
```

---

# 2. Estructura base

## 2.1 Crear estructura modular

Crear una estructura inicial similar a:

```text
src/
├── app/
├── components/
│   ├── business/
│   ├── search/
│   ├── maps/
│   ├── forms/
│   └── ui/
├── lib/
│   ├── supabase/
│   ├── analytics/
│   └── utils/
├── services/
├── types/
└── config/
```

- [x] Crear carpetas necesarias.
- [x] Evitar archivos vacíos innecesarios.

### Commit

```bash
chore: crear estructura modular inicial
```

---

## 2.2 Configurar layout global

- [x] Crear layout principal.
- [x] Configurar metadata global.
- [x] Definir idioma del documento.
- [x] Definir estilos base.
- [x] Preparar estructura responsive.

### Validación

- [x] El layout se aplica a todas las páginas.
- [x] No hay errores de hidratación.

### Commit

```bash
feat(ui): crear layout global de la aplicación
```

---

## 2.3 Crear Header

- [x] Crear componente Header.
- [x] Agregar logo temporal.
- [x] Agregar navegación principal.
- [x] Preparar menú móvil.
- [x] Hacerlo responsive.

### Commit

```bash
feat(ui): crear header responsive
```

---

## 2.4 Crear Footer

- [x] Crear Footer.
- [x] Agregar información básica.
- [x] Agregar enlaces legales temporales.
- [x] Agregar enlaces de navegación.

### Commit

```bash
feat(ui): crear footer de la plataforma
```

---

# 3. Configuración de Supabase

## 3.1 Crear proyecto Supabase

- [x] Crear proyecto en Supabase.
- [x] Guardar URL pública.
- [x] Guardar publishable key.
- [x] No publicar service role key.
- [x] Documentar nombre del proyecto.

### Commit

No realizar commit con credenciales.

---

## 3.2 Configurar variables de entorno

Crear:

```text
.env.local
.env.example
```

Ejemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

- [x] Agregar `.env.local` a `.gitignore`.
- [x] Mantener `.env.example` sin secretos.

### Commit

```bash
chore: configurar variables de entorno
```

---

## 3.3 Configurar cliente Supabase

- [x] Crear cliente para navegador.
- [x] Crear cliente para servidor.
- [x] Separar correctamente Server y Client Components.
- [x] Evitar exponer secretos.

### Validación

- [x] La conexión funciona.
- [x] No aparecen claves privadas en el bundle.

### Commit

```bash
feat(database): configurar clientes de supabase
```

---

# 4. Diseño de base de datos

## 4.1 Crear tabla de perfiles

Entidad sugerida:

```text
profiles
```

Campos iniciales:

```text
id
full_name
role
created_at
updated_at
```

Roles iniciales:

```text
owner
admin
superadmin
```

- [x] Crear migración.
- [x] Agregar restricciones necesarias.

### Commit

```bash
feat(database): crear tabla de perfiles
```

---

## 4.2 Crear tabla de negocios

Entidad:

```text
businesses
```

Campos sugeridos:

```text
id
owner_id
name
slug
description
phone
whatsapp
instagram
facebook
website
address
latitude
longitude
status
is_verified
is_featured
created_at
updated_at
```

Estados sugeridos:

```text
pending
approved
rejected
suspended
```

- [x] Crear migración.
- [x] Agregar restricciones e índices necesarios.

### Commit

```bash
feat(database): crear tabla de negocios
```

---

## 4.3 Crear categorías

Crear:

```text
categories
business_categories
```

- [x] Permitir categoría principal.
- [x] Permitir categorías secundarias.
- [x] Evitar duplicados.

### Commit

```bash
feat(database): crear estructura de categorías
```

---

## 4.4 Crear productos

Crear tabla:

```text
products
```

Campos sugeridos:

```text
id
business_id
name
description
price
image_url
is_available
created_at
updated_at
```

- [x] Crear migración.
- [x] Relacionar productos con negocios y validar sus datos.

### Commit

```bash
feat(database): crear tabla de productos
```

---

## 4.5 Crear servicios

Crear tabla:

```text
services
```

- [x] Relacionar con negocio.
- [x] Permitir nombre.
- [x] Permitir descripción.
- [x] Permitir precio opcional.

### Commit

```bash
feat(database): crear tabla de servicios
```

---

## 4.6 Crear promociones

Crear:

```text
promotions
```

Campos sugeridos:

```text
id
business_id
title
description
image_url
starts_at
ends_at
is_active
created_at
```

- [x] Crear migración.
- [x] Validar el rango de vigencia y relacionar con negocios.

### Commit

```bash
feat(database): crear tabla de promociones
```

---

## 4.7 Crear horarios

Crear:

```text
business_hours
```

Debe permitir:

- [x] Día de la semana.
- [x] Hora de apertura.
- [x] Hora de cierre.
- [x] Día cerrado.
- [x] Más de un rango horario si se requiere posteriormente.

### Commit

```bash
feat(database): crear horarios de negocios
```

---

## 4.8 Crear imágenes de negocio

Crear:

```text
business_images
```

- [x] Relacionar con negocio.
- [x] Diferenciar logo, portada y galería si es necesario.

### Commit

```bash
feat(database): crear galería de negocios
```

---

## 4.9 Crear eventos de analítica

Crear:

```text
business_events
```

Tipos iniciales:

```text
profile_view
whatsapp_click
location_click
instagram_click
product_view
promotion_view
```

- [x] Crear migración.
- [x] Validar tipos y preparar índices para reportes.

### Commit

```bash
feat(database): crear eventos de analítica
```

---

# 5. Seguridad y RLS

## 5.1 Activar RLS

- [x] Activar RLS en tablas sensibles.
- [x] Revisar qué tablas serán públicas.
- [x] No permitir escrituras anónimas no justificadas.

### Commit

```bash
feat(security): activar rls en tablas principales
```

---

## 5.2 Políticas públicas

Permitir públicamente:

- [x] Leer negocios aprobados.
- [x] Leer productos de negocios aprobados.
- [x] Leer servicios.
- [x] Leer promociones activas.
- [x] Leer categorías.

### Commit

```bash
feat(security): agregar políticas públicas de lectura
```

---

## 5.3 Políticas de propietarios

El propietario podrá:

- [x] Leer sus negocios.
- [x] Editar sus negocios.
- [x] Gestionar productos propios.
- [x] Gestionar servicios propios.
- [x] Gestionar promociones propias.
- [x] Gestionar imágenes propias.
- [x] Gestionar horarios propios.

### Commit

```bash
feat(security): agregar políticas para propietarios
```

---

## 5.4 Políticas de administrador

- [x] Permitir revisar negocios.
- [x] Permitir aprobar.
- [x] Permitir rechazar.
- [x] Permitir suspender.
- [x] Permitir administrar categorías.

### Commit

```bash
feat(security): agregar permisos administrativos
```

---

# 6. Autenticación

## 6.1 Registro de propietario

- [x] Crear página de registro.
- [x] Implementar email y contraseña.
- [x] Crear perfil después del registro.
- [x] Asignar rol `owner`.
- [x] Validar campos.

### Commit

```bash
feat(auth): implementar registro de propietarios
```

---

## 6.2 Inicio de sesión

- [x] Crear formulario.
- [x] Mostrar errores.
- [x] Redirigir al dashboard.

### Commit

```bash
feat(auth): implementar inicio de sesión
```

---

## 6.3 Cierre de sesión

- [x] Implementar logout.
- [x] Limpiar sesión.
- [x] Redirigir correctamente.

### Commit

```bash
feat(auth): implementar cierre de sesión
```

---

## 6.4 Recuperación de contraseña

- [x] Solicitar correo.
- [x] Integrar recuperación de Supabase.
- [x] Crear pantalla para nueva contraseña.

### Commit

```bash
feat(auth): implementar recuperación de contraseña
```

---

## 6.5 Protección de rutas

Proteger:

```text
/dashboard
/admin
```

- [x] Visitantes no autenticados deben ser redirigidos.
- [x] Propietarios no deben entrar a admin.
- [x] Admin debe tener permisos correctos.

### Commit

```bash
feat(auth): proteger rutas privadas por rol
```

---

# 7. Página principal

## 7.1 Crear Home

- [x] Crear hero.
- [x] Agregar buscador principal.
- [x] Agregar secciones base.
- [x] Diseñar mobile first.

### Commit

```bash
feat(home): crear página principal
```

---

## 7.2 Categorías populares

- [x] Mostrar categorías.
- [x] Enlazar a páginas por categoría.

### Commit

```bash
feat(home): mostrar categorías populares
```

---

## 7.3 Promociones activas

- [x] Consultar promociones vigentes.
- [x] Mostrar tarjetas.
- [x] Ocultar promociones vencidas.

### Commit

```bash
feat(home): mostrar promociones activas
```

---

## 7.4 Nuevos negocios

- [x] Mostrar negocios aprobados recientemente.

### Commit

```bash
feat(home): mostrar negocios recientes
```

---

# 8. Perfiles públicos de negocio

## 8.1 Crear BusinessCard

- [x] Nombre.
- [x] Logo.
- [x] Categoría.
- [x] Ubicación.
- [x] Estado abierto/cerrado.
- [x] Enlace al perfil.

### Commit

```bash
feat(business): crear tarjeta de negocio
```

---

## 8.2 Crear página pública por slug

Ruta:

```text
/negocios/[slug]
```

Mostrar:

- [x] Nombre.
- [x] Descripción.
- [x] Logo.
- [x] Portada.
- [x] Galería.
- [x] Horarios.
- [x] Dirección.
- [x] Categorías.
- [x] Productos.
- [x] Servicios.
- [x] Promociones.

### Commit

```bash
feat(business): crear perfil público de negocio
```

---

## 8.3 Metadata SEO dinámica

- [x] Generar title.
- [x] Generar description.
- [x] Open Graph.
- [x] Imagen compartible cuando exista.

### Commit

```bash
feat(seo): agregar metadata dinámica a negocios
```

---

## 8.4 Botón de WhatsApp

- [x] Crear enlace.
- [x] Generar mensaje predeterminado.
- [x] Registrar clic.

### Commit

```bash
feat(business): agregar contacto por whatsapp
```

---

## 8.5 Código QR

- [x] Generar QR de la URL pública.
- [x] Permitir visualizarlo.
- [x] Permitir descarga si se decide incluir.

### Commit

```bash
feat(business): generar código qr del negocio
```

---

# 9. Catálogo

## 9.1 Mostrar productos

- [x] Crear ProductCard.
- [x] Mostrar precio.
- [x] Mostrar disponibilidad.
- [x] Mostrar imagen optimizada.

### Commit

```bash
feat(products): mostrar catálogo de productos
```

---

## 9.2 Mostrar servicios

- [x] Crear ServiceCard.
- [x] Mostrar descripción.
- [x] Mostrar precio si existe.

### Commit

```bash
feat(services): mostrar servicios del negocio
```

---

# 10. Búsqueda y filtros

## 10.1 Búsqueda básica

- [x] Buscar por nombre de negocio.
- [x] Buscar productos.
- [x] Buscar servicios.
- [x] Buscar categorías.

### Commit

```bash
feat(search): implementar búsqueda básica
```

---

## 10.2 PostgreSQL Full Text Search

- [x] Crear índices.
- [x] Configurar búsqueda textual.
- [x] Ordenar por relevancia.

### Commit

```bash
feat(search): integrar full text search de postgresql
```

---

## 10.3 Filtro por categoría

- [x] Crear filtro.
- [x] Sincronizar con URL si es conveniente.

### Commit

```bash
feat(search): agregar filtro por categoría
```

---

## 10.4 Filtro abierto ahora

- [x] Calcular estado según horario.
- [x] Filtrar resultados.

### Commit

```bash
feat(search): agregar filtro de negocios abiertos
```

---

## 10.5 Filtro con promociones

- [x] Mostrar solo negocios con promociones activas.

### Commit

```bash
feat(search): agregar filtro de promociones activas
```

---

# 11. Mapas y geolocalización

## 11.1 Integrar Leaflet

- [x] Crear componente cliente.
- [x] Cargar estilos correctamente.
- [x] Evitar errores SSR.

### Commit

```bash
feat(map): integrar leaflet
```

---

## 11.2 Mostrar negocios en mapa

- [x] Agregar marcadores.
- [x] Mostrar información básica.
- [x] Enlazar al perfil.

### Commit

```bash
feat(map): mostrar negocios en el mapa
```

---

## 11.3 Geolocalización del visitante

- [x] Solicitar permiso.
- [x] Manejar rechazo.
- [x] Obtener coordenadas.

### Commit

```bash
feat(map): agregar geolocalización del visitante
```

---

## 11.4 Ordenar por distancia

- [x] Calcular distancia.
- [x] Mostrar distancia.
- [x] Ordenar resultados.

### Commit

```bash
feat(map): ordenar negocios por distancia
```

---

# 12. Panel del propietario

## 12.1 Crear dashboard

- [x] Crear navegación.
- [x] Mostrar resumen.
- [x] Mostrar estado del negocio.

### Commit

```bash
feat(business): crear dashboard del propietario
```

---

## 12.2 Crear negocio

- [x] Crear formulario.
- [x] Validar datos.
- [x] Guardar como `pending`.

### Commit

```bash
feat(business): implementar registro de negocio
```

---

## 12.3 Editar negocio

- [x] Cargar información.
- [x] Editar campos.
- [x] Guardar cambios.

### Commit

```bash
feat(business): permitir editar negocio
```

---

## 12.4 Configurar horarios

- [x] Crear formulario semanal.
- [x] Guardar apertura/cierre.
- [x] Manejar días cerrados.

### Commit

```bash
feat(business): permitir configurar horarios
```

---

## 12.5 Administrar productos

- [x] Crear.
- [x] Editar.
- [x] Eliminar.
- [x] Cambiar disponibilidad.

### Commit

```bash
feat(products): crear gestión de productos
```

---

## 12.6 Administrar servicios

- [x] Crear.
- [x] Editar.
- [x] Eliminar.

### Commit

```bash
feat(services): crear gestión de servicios
```

---

## 12.7 Administrar promociones

- [x] Crear.
- [x] Editar.
- [x] Eliminar.
- [x] Definir fechas.

### Commit

```bash
feat(promotions): crear gestión de promociones
```

---

# 13. Imágenes y Storage

## 13.1 Configurar buckets

- [x] Crear buckets.
- [x] Configurar permisos.
- [x] Definir estructura de paths.

### Commit

```bash
feat(storage): configurar buckets de imágenes
```

---

## 13.2 Subir logo

- [x] Validar tipo.
- [x] Validar peso.
- [x] Optimizar imagen.
- [x] Guardar URL.

### Commit

```bash
feat(storage): permitir subir logo del negocio
```

---

## 13.3 Subir portada

- [x] Optimizar.
- [x] Reemplazar imagen anterior correctamente.

### Commit

```bash
feat(storage): permitir subir portada del negocio
```

---

## 13.4 Galería

- [x] Subir varias imágenes.
- [x] Definir límite.
- [x] Eliminar imágenes.

### Commit

```bash
feat(storage): crear galería de negocio
```

---

## 13.5 Imágenes de productos

- [x] Optimizar antes de subir.
- [x] Guardar.
- [x] Reemplazar.
- [x] Eliminar.

### Commit

```bash
feat(storage): agregar imágenes de productos
```

---

# 14. Panel administrativo

## 14.1 Crear layout administrativo

- [x] Sidebar.
- [x] Navegación.
- [x] Protección por rol.

### Commit

```bash
feat(admin): crear panel administrativo
```

---

## 14.2 Revisar negocios pendientes

- [x] Listar pendientes.
- [x] Ver detalle.

### Commit

```bash
feat(admin): listar negocios pendientes
```

---

## 14.3 Aprobar negocio

- [ ] Cambiar estado.
- [ ] Registrar acción.

### Commit

```bash
feat(admin): permitir aprobar negocios
```

---

## 14.4 Rechazar negocio

- [ ] Permitir rechazo.
- [ ] Guardar motivo si se decide.

### Commit

```bash
feat(admin): permitir rechazar negocios
```

---

## 14.5 Suspender negocio

- [ ] Cambiar estado.
- [ ] Ocultar del directorio público.

### Commit

```bash
feat(admin): permitir suspender negocios
```

---

## 14.6 Administrar categorías

- [ ] Crear.
- [ ] Editar.
- [ ] Eliminar si no rompe relaciones.

### Commit

```bash
feat(admin): crear gestión de categorías
```

---

# 15. Estadísticas

## 15.1 Registrar visitas

- [ ] Registrar `profile_view`.
- [ ] Evitar contar eventos claramente duplicados si se decide.

### Commit

```bash
feat(analytics): registrar visitas de negocios
```

---

## 15.2 Registrar clics

Eventos:

- [ ] WhatsApp.
- [ ] Ubicación.
- [ ] Instagram.
- [ ] Producto.
- [ ] Promoción.

### Commit

```bash
feat(analytics): registrar interacciones del visitante
```

---

## 15.3 Dashboard de métricas

Mostrar:

- [ ] Visitas.
- [ ] Clics en WhatsApp.
- [ ] Productos más vistos.
- [ ] Promociones más vistas.

### Commit

```bash
feat(analytics): mostrar estadísticas al propietario
```

---

# 16. Turnstile y protección antiabuso

## 16.1 Configurar Turnstile

- [ ] Crear widget.
- [ ] Configurar site key.
- [ ] Configurar secret en servidor.
- [ ] Validar token en servidor.

### Commit

```bash
feat(security): integrar cloudflare turnstile
```

---

## 16.2 Proteger registro

- [ ] Agregar Turnstile al registro.

### Commit

```bash
feat(security): proteger registro con turnstile
```

---

# 17. Responsive y accesibilidad

## 17.1 Revisión móvil

Revisar:

- [ ] Home.
- [ ] Búsqueda.
- [ ] Perfil de negocio.
- [ ] Dashboard.
- [ ] Admin.
- [ ] Formularios.
- [ ] Mapa.

### Commit

```bash
style: mejorar experiencia responsive
```

---

## 17.2 Accesibilidad básica

- [ ] Labels.
- [ ] Alt text.
- [ ] Navegación con teclado.
- [ ] Contraste.
- [ ] Focus states.
- [ ] Botones semánticos.

### Commit

```bash
refactor(ui): mejorar accesibilidad de la interfaz
```

---

# 18. SEO técnico

## 18.1 Sitemap

- [ ] Generar sitemap.
- [ ] Incluir negocios aprobados.
- [ ] Incluir categorías.

### Commit

```bash
feat(seo): generar sitemap dinámico
```

---

## 18.2 Robots

- [ ] Crear robots.txt.
- [ ] Bloquear rutas privadas.

### Commit

```bash
feat(seo): configurar robots del sitio
```

---

## 18.3 URLs canónicas

- [ ] Configurar canonical cuando sea necesario.

### Commit

```bash
feat(seo): configurar urls canónicas
```

---

# 19. Pruebas

## 19.1 Pruebas de utilidades

- [ ] Horarios.
- [ ] Formateadores.
- [ ] Validaciones.
- [ ] Distancias.

### Commit

```bash
test: agregar pruebas de utilidades
```

---

## 19.2 Pruebas de formularios

- [ ] Login.
- [ ] Registro.
- [ ] Negocio.
- [ ] Producto.
- [ ] Promoción.

### Commit

```bash
test: agregar pruebas de formularios principales
```

---

## 19.3 Flujo crítico

Probar:

```text
Registro
↓
Crear negocio
↓
Admin aprueba
↓
Negocio aparece públicamente
↓
Usuario abre perfil
↓
Usuario hace clic en WhatsApp
↓
Evento queda registrado
```

### Commit

```bash
test: validar flujo principal del negocio
```

---

# 20. Preparación para producción

## 20.1 Revisar variables

- [ ] Development.
- [ ] Preview.
- [ ] Production.
- [ ] No existen secretos en Git.

### Commit

```bash
chore: preparar variables de entorno de producción
```

---

## 20.2 Crear build

Ejecutar:

```bash
npm run lint
npm run build
```

- [ ] Corregir warnings importantes.
- [ ] Corregir errores.

### Commit

```bash
fix: corregir errores previos al despliegue
```

Solo crear este commit si existen correcciones.

---

## 20.3 Desplegar

- [ ] Conectar repositorio.
- [ ] Configurar variables.
- [ ] Crear deployment.
- [ ] Verificar aplicación.

### Commit

No necesariamente requiere commit si no cambia código.

---

## 20.4 Configurar dominio

- [ ] Comprar dominio.
- [ ] Configurar DNS.
- [ ] Configurar HTTPS.
- [ ] Configurar URL en Supabase Auth.
- [ ] Revisar enlaces absolutos.

### Commit

```bash
chore: configurar dominio de producción
```

Solo si existe configuración versionada relacionada.

---

# 21. Validación del MVP

Antes de considerar terminado el MVP:

## Visitante

- [ ] Puede abrir la plataforma sin cuenta.
- [ ] Puede buscar negocios.
- [ ] Puede filtrar.
- [ ] Puede ver categorías.
- [ ] Puede ver promociones.
- [ ] Puede ver un negocio.
- [ ] Puede ver productos.
- [ ] Puede ver servicios.
- [ ] Puede ver ubicación.
- [ ] Puede contactar por WhatsApp.
- [ ] Puede ver si está abierto.

## Propietario

- [ ] Puede registrarse.
- [ ] Puede iniciar sesión.
- [ ] Puede crear negocio.
- [ ] Puede editar negocio.
- [ ] Puede subir imágenes.
- [ ] Puede administrar productos.
- [ ] Puede administrar servicios.
- [ ] Puede administrar promociones.
- [ ] Puede configurar horarios.
- [ ] Puede consultar estadísticas.

## Administrador

- [ ] Puede iniciar sesión.
- [ ] Puede ver pendientes.
- [ ] Puede aprobar.
- [ ] Puede rechazar.
- [ ] Puede suspender.
- [ ] Puede gestionar categorías.

## Seguridad

- [ ] RLS activa.
- [ ] Propietarios no modifican negocios ajenos.
- [ ] Visitantes no acceden a rutas privadas.
- [ ] Archivos restringidos correctamente.
- [ ] No existen secretos publicados.
- [ ] Turnstile funciona.

---

# 22. Revisión final con Codex

Antes del lanzamiento pedir a Codex realizar una revisión completa basada en los documentos:

```text
01_LEVANTAMIENTO_REQUERIMIENTOS.md
02_ARQUITECTURA_Y_TECNOLOGIAS.md
03_GUIA_COMMITS.md
04_CHECKLIST_IMPLEMENTACION.md
```

Solicitar revisión de:

- [ ] Requerimientos faltantes.
- [ ] Seguridad.
- [ ] RLS.
- [ ] Errores TypeScript.
- [ ] Componentes duplicados.
- [ ] Dependencias innecesarias.
- [ ] Rendimiento.
- [ ] SEO.
- [ ] Responsive.
- [ ] Accesibilidad.
- [ ] Variables de entorno.
- [ ] Manejo de errores.
- [ ] Storage.
- [ ] Costos potenciales.

### Commit final de ajustes

```bash
refactor: aplicar revisión técnica previa al lanzamiento
```

Solo si la revisión genera cambios reales.

---

# 23. Regla de trabajo con Codex

No pedir:

> Implementa todo el sistema de negocios.

Preferir:

> Implementa únicamente la tarea 12.2 de `04_CHECKLIST_IMPLEMENTACION.md`.  
> Revisa `01_LEVANTAMIENTO_REQUERIMIENTOS.md`, `02_ARQUITECTURA_Y_TECNOLOGIAS.md` y `03_GUIA_COMMITS.md`.  
> No avances a ninguna otra tarea.  
> Al finalizar, ejecuta las validaciones necesarias y dime qué archivos modificaste y qué commit corresponde.

---

# 24. Plantilla de prompt para cada tarea

Utilizar:

```text
Vamos a trabajar en la tarea [NÚMERO] de docs/04_CHECKLIST_IMPLEMENTACION.md.

Antes de modificar código:
1. Lee docs/01_LEVANTAMIENTO_REQUERIMIENTOS.md.
2. Lee docs/02_ARQUITECTURA_Y_TECNOLOGIAS.md.
3. Lee docs/03_GUIA_COMMITS.md.
4. Lee la tarea correspondiente en docs/04_CHECKLIST_IMPLEMENTACION.md.

Implementa únicamente esa tarea.

Condiciones:
- No avances a tareas posteriores.
- No cambies el stack definido.
- Evita dependencias innecesarias.
- Respeta TypeScript.
- Mantén la arquitectura modular.
- Aplica seguridad y RLS cuando corresponda.
- Ejecuta lint, typecheck o build cuando aplique.
- Indica los archivos modificados.
- Indica cómo validar la implementación.
- Sugiere el commit siguiendo docs/03_GUIA_COMMITS.md.
- No hagas el commit si no te lo solicito explícitamente.
```

---

# 25. Regla para marcar tareas

Después de validar manualmente una implementación:

Cambiar:

```markdown
- [ ] Tarea
```

por:

```markdown
- [x] Tarea
```

No marcar una tarea como completada únicamente porque Codex indique que terminó.

La tarea se considera completada cuando:

1. El código fue implementado.
2. La aplicación compila.
3. La funcionalidad fue probada.
4. No rompió funcionalidades anteriores.
5. Se creó el commit correspondiente.

---

# 26. Criterio de avance

No avanzar a la siguiente fase si existen:

- Errores de build.
- Errores TypeScript importantes.
- Problemas de seguridad conocidos.
- Migraciones pendientes.
- Funciones críticas sin validar.

La prioridad será:

```text
Funciona
↓
Es seguro
↓
Es mantenible
↓
Está probado
↓
Se hace commit
↓
Se continúa
```

---

# 27. Estado del proyecto

## Fase actual

```text
[ ] Preparación
[ ] Estructura
[ ] Base de datos
[ ] Seguridad
[ ] Autenticación
[ ] Interfaz pública
[ ] Búsqueda
[ ] Mapas
[ ] Dashboard
[ ] Administración
[ ] Analytics
[ ] Seguridad antiabuso
[ ] Testing
[ ] Producción
[ ] MVP terminado
```

Actualizar esta sección conforme avance el desarrollo.
