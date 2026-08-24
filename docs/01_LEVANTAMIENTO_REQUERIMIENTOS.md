# 01 — Levantamiento de Requerimientos

## Plataforma Comercial La Virginia

### 1. Descripción general

Se propone desarrollar una plataforma web enfocada inicialmente en **La Virginia, Risaralda**, cuyo objetivo sea centralizar y dar visibilidad a los emprendimientos, empresas, comercios y profesionales independientes del municipio.

La plataforma permitirá que los habitantes descubran negocios, productos, servicios y promociones disponibles en La Virginia desde un único lugar.

La propuesta no busca ser únicamente un directorio empresarial, sino una plataforma de **descubrimiento comercial local** que facilite la conexión entre clientes y negocios.

---

## 2. Problema identificado

Actualmente muchos negocios locales dependen principalmente de:

- Instagram.
- Facebook.
- Estados de WhatsApp.
- Grupos de WhatsApp.
- Recomendaciones personales.
- Google Maps.

Esto ocasiona que encontrar determinados productos o servicios sea difícil si el usuario no conoce previamente el nombre del negocio.

Por ejemplo, una persona puede necesitar:

> “Una torta para mañana.”

Pero no necesariamente sabe qué emprendimientos de La Virginia ofrecen ese producto.

La plataforma busca resolver este problema mediante un sistema centralizado de búsqueda y descubrimiento.

---

## 3. Objetivo general

Desarrollar una plataforma web que permita a los habitantes de La Virginia descubrir fácilmente negocios, emprendimientos, servicios, productos y promociones locales, mientras que los comercios obtienen una nueva herramienta digital para aumentar su visibilidad y atraer clientes.

---

## 4. Objetivos específicos

- Centralizar información de negocios y emprendimientos de La Virginia.
- Facilitar la búsqueda de productos y servicios.
- Permitir que los comercios creen y administren su propia presencia digital.
- Mostrar negocios según categorías y ubicación.
- Permitir la publicación de promociones.
- Facilitar el contacto directo entre clientes y negocios mediante WhatsApp.
- Generar estadísticas que permitan a los negocios medir el interés generado por la plataforma.
- Crear una herramienta que pueda posteriormente expandirse a otros municipios.

---

## 5. Tipos de usuario

### 5.1 Visitante

Persona que utiliza la plataforma para buscar productos, servicios o negocios.

No debería ser obligatorio registrarse para consultar información.

Podrá:

- Buscar negocios.
- Buscar productos o servicios.
- Consultar categorías.
- Ver promociones.
- Consultar negocios abiertos.
- Ver negocios cercanos.
- Consultar perfiles.
- Ver ubicación.
- Contactar por WhatsApp.
- Compartir negocios.

### 5.2 Propietario de negocio

Persona responsable de administrar el perfil de un emprendimiento, empresa o comercio.

Podrá:

- Registrarse.
- Crear un negocio.
- Editar información.
- Agregar fotografías.
- Registrar productos o servicios.
- Definir horarios.
- Registrar ubicación.
- Publicar promociones.
- Consultar estadísticas.
- Administrar su perfil.

### 5.3 Administrador

Usuario responsable de administrar la plataforma.

Podrá:

- Revisar negocios registrados.
- Aprobar o rechazar negocios.
- Administrar categorías.
- Gestionar usuarios.
- Eliminar contenido inapropiado.
- Administrar negocios destacados.
- Gestionar promociones.
- Consultar estadísticas generales.

---

## 6. Flujo principal del visitante

1. El usuario entra a la plataforma.
2. Busca un producto, servicio o negocio.
3. La plataforma muestra resultados relacionados.
4. El usuario puede aplicar filtros.
5. Selecciona un negocio.
6. Visualiza la información del perfil.
7. Puede contactar por WhatsApp o consultar la ubicación.

Ejemplo:

```text
Inicio
  ↓
Buscar: "Tortas"
  ↓
Resultados
  ↓
Filtros:
- Cerca de mí
- Abierto ahora
- Categoría
- Con promociones
  ↓
Perfil del negocio
  ↓
WhatsApp / Ubicación
```

---

## 7. Flujo principal del negocio

1. El propietario se registra.
2. Crea el perfil de su negocio.
3. Completa la información requerida.
4. Envía el negocio para revisión.
5. Un administrador aprueba el negocio.
6. El perfil queda publicado.
7. El propietario puede mantener actualizada la información.

Información inicial:

- Nombre.
- Descripción.
- Categoría.
- Logo.
- Fotografías.
- WhatsApp.
- Redes sociales.
- Dirección.
- Ubicación.
- Horarios.

Posteriormente podrá:

- Actualizar información.
- Agregar productos.
- Publicar promociones.
- Consultar estadísticas.

---

## 8. Información del negocio

Cada negocio deberá poder tener:

- Nombre.
- Logo.
- Imagen de portada.
- Descripción.
- Categoría principal.
- Categorías secundarias.
- Dirección.
- Ubicación geográfica.
- WhatsApp.
- Teléfono.
- Instagram.
- Facebook.
- Página web.
- Horarios.
- Fotografías.
- Productos.
- Servicios.
- Promociones.

Cada negocio tendrá una URL pública.

Ejemplo:

```text
plataforma.com/negocios/dulce-maria
```

---

## 9. Categorías

Ejemplos iniciales:

- Restaurantes.
- Comidas rápidas.
- Repostería.
- Moda.
- Belleza.
- Barberías.
- Salud.
- Tecnología.
- Fotografía.
- Ferreterías.
- Talleres.
- Mascotas.
- Hoteles.
- Turismo.
- Educación.
- Servicios profesionales.
- Hogar.
- Transporte.
- Entretenimiento.

Las categorías deberán poder ser administradas desde el panel administrativo.

---

## 10. Productos y servicios

Los negocios podrán registrar productos o servicios.

Cada elemento podrá contener:

- Nombre.
- Fotografía.
- Descripción.
- Precio.
- Categoría.
- Estado de disponibilidad.

Ejemplo:

```text
Torta de chocolate
$55.000
Disponible
```

---

## 11. Promociones

Los negocios podrán crear promociones temporales.

Cada promoción tendrá:

- Título.
- Descripción.
- Imagen.
- Fecha inicial.
- Fecha final.
- Negocio asociado.

Ejemplo:

> 20% de descuento en hamburguesas durante este viernes.

Las promociones vencidas deberán ocultarse automáticamente.

---

## 12. Buscador

El buscador deberá permitir encontrar información mediante:

- Nombre del negocio.
- Producto.
- Servicio.
- Categoría.
- Palabras relacionadas.

Ejemplo:

```text
Usuario escribe:
"Arreglar celular"

Resultados posibles:
- Reparación de celulares.
- Tiendas de tecnología.
- Técnicos.
```

---

## 13. Negocios cerca de mí

Con autorización del usuario, la plataforma podrá utilizar su ubicación.

Esto permitirá:

- Mostrar negocios cercanos.
- Ordenarlos por distancia.
- Visualizarlos en un mapa.

El usuario deberá poder utilizar la plataforma aunque decida no compartir su ubicación.

---

## 14. Abierto ahora

Cada negocio podrá configurar sus horarios.

La plataforma podrá indicar:

- 🟢 Abierto ahora.
- 🔴 Cerrado.

También podrá existir un filtro:

> Mostrar únicamente negocios abiertos.

---

## 15. Contacto por WhatsApp

Cada negocio tendrá un botón:

> **Contactar por WhatsApp**

El sistema podrá generar automáticamente un mensaje como:

> Hola, encontré su negocio en la plataforma y quisiera recibir información sobre...

Esto permitirá medir cuántos contactos genera la plataforma.

---

## 16. Estadísticas para negocios

Cada propietario podrá visualizar información como:

- Visitas al perfil.
- Visualizaciones de productos.
- Clics en WhatsApp.
- Clics en ubicación.
- Clics en redes sociales.
- Promociones más vistas.

Esto representa uno de los principales incentivos para que los negocios utilicen la plataforma.

---

## 17. Código QR

Cada negocio podrá tener un código QR asociado a su perfil.

El comerciante podrá utilizarlo en:

- Local.
- Tarjetas.
- Menús.
- Publicidad.
- Redes sociales.

Al escanearlo se abrirá directamente el perfil del negocio.

---

## 18. Página principal

La página principal deberá estar enfocada en descubrimiento.

Ejemplo:

### ¿Qué necesita hoy?

```text
🔍 Buscar productos, servicios o negocios
```

### Categorías populares

- 🍔 Comida.
- 💇 Belleza.
- 🛠️ Servicios.
- 👕 Moda.
- 📱 Tecnología.

### Secciones sugeridas

- Promociones de hoy.
- Negocios cerca de usted.
- Nuevos en la plataforma.
- Abiertos ahora.

---

## 19. Sistema de destacados

La plataforma podrá permitir que algunos negocios aparezcan destacados.

Ejemplo:

> ⭐ Negocio destacado

Estos establecimientos podrían aparecer:

- Primero en resultados.
- En la página principal.
- Dentro de categorías.
- Dentro de promociones.

Inicialmente esta funcionalidad podría utilizarse gratuitamente para incentivar negocios.

Posteriormente podría convertirse en una fuente de monetización.

---

## 20. Perfil verificado

Los negocios cuya información haya sido comprobada podrán recibir una insignia:

> ✓ Negocio verificado

La verificación podría confirmar:

- Existencia del negocio.
- Número de contacto.
- Ubicación.
- Responsable.

---

## 21. Compartir negocios

Los usuarios podrán compartir perfiles mediante:

- WhatsApp.
- Facebook.
- Copiar enlace.

Esto permitirá que los propios usuarios ayuden a distribuir la plataforma.

---

## 22. Favoritos

En una versión posterior se podría permitir que los usuarios guarden negocios favoritos.

Esto probablemente requeriría que el usuario tenga una cuenta.

No es necesario para el MVP.

---

## 23. Reseñas

Las reseñas podrían implementarse posteriormente.

No se recomienda incluirlas en la primera versión debido a que requieren:

- Moderación.
- Control de spam.
- Manejo de conflictos.
- Identificación de usuarios.

Inicialmente esta funcionalidad se mantendrá fuera del MVP.

---

## 24. Panel del negocio

El propietario tendrá un panel desde donde podrá administrar:

### Mi negocio

Información general.

### Productos y servicios

Catálogo.

### Promociones

Ofertas activas.

### Fotografías

Galería.

### Horarios

Disponibilidad.

### Estadísticas

Resultados obtenidos dentro de la plataforma.

---

## 25. Panel administrativo

El administrador podrá gestionar:

### Negocios

- Aprobar.
- Suspender.
- Editar.
- Eliminar.

### Usuarios

- Consultar propietarios.
- Suspender cuentas.

### Categorías

- Crear.
- Editar.
- Eliminar.

### Promociones

- Revisar.
- Moderar.
- Eliminar.

### Destacados

- Administrar negocios promocionados.

### Estadísticas

- Consultar actividad general de la plataforma.

---

## 26. Requisitos funcionales

### RF01
El sistema deberá permitir consultar negocios sin iniciar sesión.

### RF02
El sistema deberá permitir buscar negocios, productos y servicios.

### RF03
El sistema deberá permitir filtrar negocios por categoría.

### RF04
El sistema deberá permitir visualizar negocios en un mapa.

### RF05
El sistema deberá permitir consultar negocios cercanos.

### RF06
El sistema deberá mostrar si un negocio está abierto o cerrado.

### RF07
El sistema deberá permitir que propietarios se registren.

### RF08
El propietario deberá poder registrar un negocio.

### RF09
El propietario deberá poder actualizar la información de su negocio.

### RF10
El propietario deberá poder registrar productos y servicios.

### RF11
El propietario deberá poder publicar promociones.

### RF12
El sistema deberá permitir subir fotografías.

### RF13
El usuario deberá poder contactar negocios mediante WhatsApp.

### RF14
El sistema deberá registrar estadísticas de interacción.

### RF15
Los administradores deberán poder aprobar negocios.

### RF16
Los administradores deberán poder gestionar categorías.

### RF17
Los administradores deberán poder suspender negocios.

### RF18
Cada negocio deberá tener una página pública propia.

### RF19
El sistema deberá generar un QR para cada negocio.

### RF20
El sistema deberá permitir compartir negocios mediante enlaces.

---

## 27. Requisitos no funcionales

### Rendimiento

La plataforma deberá cargar rápidamente incluso utilizando conexiones móviles.

### Responsive

Deberá funcionar correctamente en:

- Celulares.
- Tablets.
- Computadores.

La prioridad será la experiencia móvil.

### Seguridad

Deberá existir:

- Autenticación segura.
- Control de permisos.
- Protección de información privada.
- Validación de archivos.
- Protección contra spam.

### Disponibilidad

La plataforma deberá poder operar permanentemente mediante infraestructura cloud.

### Escalabilidad

Aunque inicialmente funcione únicamente en La Virginia, la arquitectura deberá permitir posteriormente incorporar:

- Pereira.
- Dosquebradas.
- Otros municipios de Risaralda.
- Otros departamentos.

---

## 28. MVP — Primera versión

Para evitar desarrollar demasiadas funciones antes de validar la idea, la primera versión deberá incluir:

### Visitantes

- Página principal.
- Buscador.
- Categorías.
- Filtros.
- Perfiles de negocios.
- Catálogo.
- Promociones.
- Mapa.
- Abierto ahora.
- Contacto por WhatsApp.

### Negocios

- Registro.
- Creación de perfil.
- Fotografías.
- Productos o servicios.
- Horarios.
- Promociones.
- Ubicación.
- Panel básico.

### Administradores

- Inicio de sesión.
- Aprobación de negocios.
- Gestión de negocios.
- Gestión de categorías.

---

## 29. Funcionalidades posteriores

Después de validar el MVP podrán desarrollarse:

- Favoritos.
- Reseñas.
- Notificaciones.
- Aplicación PWA.
- Recomendaciones personalizadas.
- Búsqueda con inteligencia artificial.
- Planes premium.
- Publicidad.
- Promociones patrocinadas.
- Reservas.
- Cupones digitales.
- Sistema de fidelización.
- Eventos locales.
- Integración con redes sociales.

---

## 30. Modelo inicial de monetización

La plataforma podrá comenzar siendo gratuita.

Posteriormente podrán existir:

### Plan gratuito

- Perfil.
- Información.
- WhatsApp.
- Ubicación.
- Catálogo limitado.

### Plan premium

- Más productos.
- Más fotografías.
- Estadísticas avanzadas.
- Promociones.
- Posicionamiento preferente.
- Personalización adicional.

También podrán venderse espacios destacados sin necesidad de cobrar una suscripción.

---

## 31. Métricas principales

Para determinar si el proyecto funciona deberán medirse:

- Negocios registrados.
- Negocios activos.
- Visitantes mensuales.
- Búsquedas realizadas.
- Clics hacia WhatsApp.
- Visitas a negocios.
- Promociones consultadas.
- Usuarios recurrentes.

La métrica principal inicialmente será:

> **Cantidad de contactos reales generados entre usuarios y negocios.**

---

## 32. Alcance inicial

La primera implementación estará enfocada exclusivamente en:

> **La Virginia, Risaralda.**

Sin embargo, desde el diseño de la base de datos deberán contemplarse conceptos como:

- Municipio.
- Departamento.
- País.

Esto permitirá crecer posteriormente sin reconstruir el sistema.

---

## 33. Restricciones iniciales

Durante la primera etapa:

- No se gestionarán pagos entre clientes y negocios.
- No se implementarán domicilios propios.
- No se incluirán reseñas en el MVP.
- Los visitantes no necesitarán una cuenta.
- El proyecto buscará operar inicialmente con infraestructura gratuita.
- El dominio será el principal costo obligatorio inicial.
- Las funcionalidades deberán priorizar validación rápida antes que complejidad técnica.

---

## 34. Criterios generales para Codex

Durante el desarrollo se deberá:

- Mantener TypeScript estricto cuando sea posible.
- Evitar lógica duplicada.
- Crear componentes reutilizables.
- Mantener responsabilidades separadas por módulos.
- Validar datos tanto en frontend como en servidor/base de datos cuando corresponda.
- Mantener secretos fuera del repositorio.
- Utilizar variables de entorno.
- Aplicar políticas RLS en Supabase.
- Priorizar accesibilidad y responsive design.
- Optimizar imágenes antes de almacenarlas.
- Mantener SEO en páginas públicas.
- Evitar introducir tecnologías que no estén justificadas por un requerimiento.
- Realizar cambios pequeños y commits frecuentes siguiendo `03_GUIA_COMMITS.md`.

---

## 35. Documentos relacionados

Este documento deberá utilizarse junto con:

```text
01_LEVANTAMIENTO_REQUERIMIENTOS.md
02_ARQUITECTURA_Y_TECNOLOGIAS.md
03_GUIA_COMMITS.md
```

El levantamiento de requerimientos define **qué debe hacer el sistema**.

El documento de arquitectura define **con qué tecnologías y arquitectura se construirá**.

La guía de commits define **cómo registrar los avances del desarrollo**.

---

## 36. Próximo paso

Después de aprobar los requerimientos y la arquitectura, deberá crearse una guía de implementación paso a paso que funcione como checklist del proyecto.

Dicha guía deberá dividir el desarrollo en tareas pequeñas y verificables para facilitar:

- Trabajo colaborativo.
- Uso de Codex.
- Commits frecuentes.
- Seguimiento del progreso.
- Pruebas antes de avanzar.
