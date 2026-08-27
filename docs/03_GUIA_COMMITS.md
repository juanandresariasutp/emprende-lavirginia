# Guía de Commits — Plataforma Comercial La Virginia

> Los ejemplos históricos relacionados con promociones pertenecen al alcance
> original y no deben implementarse. El módulo fue retirado el 27 de agosto de
> 2026.

Este documento define la convención de commits del proyecto para mantener un historial claro, ordenado y fácil de revisar.

## 1. Formato general

Usar siempre:

```bash
tipo: descripción breve
```

Ejemplo:

```bash
feat: agregar registro de negocios
```

La descripción debe:
- Escribirse en español.
- Ser corta y específica.
- Comenzar en minúscula.
- Usar verbo en infinitivo cuando sea posible.
- No terminar en punto.
- Describir un solo cambio principal.

## 2. Tipos de commit

### `feat`
Nueva funcionalidad.

```bash
feat: crear formulario de registro de negocios
feat: agregar filtro de negocios abiertos
feat: implementar inicio de sesión con Supabase
```

### `fix`
Corrección de errores.

```bash
fix: corregir cálculo de distancia entre negocios
fix: evitar envío del formulario con campos vacíos
fix: corregir redirección después del inicio de sesión
```

### `refactor`
Reorganización o mejora interna sin cambiar el comportamiento funcional.

```bash
refactor: separar lógica de negocios en servicios
refactor: simplificar componente BusinessCard
```

### `style`
Cambios visuales o de estilos.

```bash
style: ajustar diseño responsive del header
style: mejorar espaciado de tarjetas de negocios
```

### `docs`
Documentación.

```bash
docs: agregar instrucciones de instalación
docs: actualizar arquitectura del proyecto
```

### `chore`
Configuración, mantenimiento o tareas auxiliares.

```bash
chore: configurar Tailwind CSS
chore: actualizar dependencias
chore: agregar variables al archivo env example
```

### `test`
Pruebas.

```bash
test: agregar pruebas del formulario de registro
test: validar comportamiento del buscador
```

### `perf`
Mejoras de rendimiento.

```bash
perf: optimizar carga de imágenes de negocios
perf: reducir consultas del listado de negocios
```

### `build`
Dependencias, compilación o configuración del build.

```bash
build: instalar librería leaflet
build: agregar dependencia de supabase
```

### `ci`
Integración y despliegue continuo.

```bash
ci: configurar despliegue automático
ci: agregar validación de build en pull requests
```

## 3. Commits pequeños

Evitar:

```bash
feat: crear toda la plataforma
```

Preferir:

```bash
feat: crear estructura inicial de navegación
feat: crear tarjeta de negocio
feat: agregar listado de categorías
feat: implementar formulario de registro
feat: integrar formulario con supabase
```

Cada commit debe representar un avance concreto y entendible.

## 4. Un cambio por commit

Incorrecto:

```bash
feat: agregar login y cambiar colores y corregir mapa
```

Correcto:

```bash
feat: implementar inicio de sesión
style: actualizar colores del formulario de acceso
fix: corregir ubicación inicial del mapa
```

## 5. Alcance opcional

Cuando ayude a identificar el módulo afectado:

```bash
tipo(alcance): descripción
```

Ejemplos:

```bash
feat(auth): implementar recuperación de contraseña
feat(business): agregar edición del perfil comercial
feat(search): agregar filtro por categoría
fix(map): corregir marcador duplicado
style(home): ajustar sección de promociones
```

Alcances sugeridos:

```text
auth
business
products
services
promotions
search
map
admin
analytics
ui
database
storage
seo
```

## 6. Breaking changes

Si un cambio rompe compatibilidad:

```bash
feat(database)!: modificar estructura de la tabla businesses
```

Y, si hace falta:

```text
BREAKING CHANGE: se reemplaza owner_id por una relación mediante business_owners
```

## 7. Verbos recomendados

```text
agregar
crear
implementar
corregir
actualizar
eliminar
configurar
optimizar
refactorizar
validar
integrar
mostrar
permitir
proteger
```

Preferir:

```bash
feat: agregar búsqueda de negocios por nombre
```

En lugar de:

```bash
feat: búsqueda
```

## 8. Flujo antes de cada commit

```bash
git status
git diff
git add .
git commit -m "feat: agregar formulario de registro de negocios"
git push
```

## 9. Commits iniciales sugeridos

```bash
chore: inicializar proyecto con nextjs y typescript
chore: configurar tailwind css
chore: configurar shadcn ui
chore: configurar eslint y prettier
docs: agregar documentación inicial del proyecto
chore: configurar variables de entorno
feat: configurar cliente de supabase
feat: crear estructura base de navegación
feat: crear layout principal
feat: crear página de inicio
feat: crear listado de categorías
feat: crear componente de tarjeta de negocio
feat: crear página pública de negocio
```

## 10. Ejemplo de evolución de una funcionalidad

Para el registro de negocios:

```bash
feat(business): crear formulario de registro
feat(business): agregar validaciones del formulario
feat(database): crear tabla businesses
feat(business): integrar registro con supabase
feat(storage): permitir subir logo del negocio
feat(map): agregar selección de ubicación
style(business): ajustar formulario para dispositivos móviles
test(business): agregar pruebas del formulario
```

## 11. Regla del proyecto

Antes de hacer un commit, debe poder completarse:

> Este commit únicamente se encarga de __________.

Si la respuesta incluye varias funcionalidades independientes, crear varios commits.

## 12. Resumen rápido

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de errores |
| `refactor` | Mejora interna del código |
| `style` | Cambios visuales |
| `docs` | Documentación |
| `chore` | Configuración y mantenimiento |
| `test` | Pruebas |
| `perf` | Rendimiento |
| `build` | Dependencias y compilación |
| `ci` | Integración y despliegue |

Formato recomendado:

```bash
tipo(alcance): descripción
```

Ejemplo:

```bash
feat(business): permitir publicar promociones
```
