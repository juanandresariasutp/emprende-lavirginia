-- Datos ficticios para probar los listados públicos.
-- Se pueden retirar sin afectar datos reales con:
-- delete from public.businesses where slug like 'demo-%';

do $$
begin
  if not exists (select 1 from public.profiles) then
    raise exception 'Se necesita al menos un perfil para asignar los negocios demo';
  end if;
end;
$$;

with demo_owner as (
  select id from public.profiles order by created_at asc limit 1
), seed (name, slug, description, latitude, longitude, verified, featured) as (
  values
    ('Café Río Dulce — Demo', 'demo-cafe-rio-dulce', 'Cafetería ficticia con bebidas calientes y repostería artesanal. Datos creados únicamente para demostración.', 4.899800::numeric, -75.882500::numeric, true, true),
    ('Sabores del Puente — Demo', 'demo-sabores-del-puente', 'Restaurante ficticio de comida casera y almuerzos del día. Datos creados únicamente para demostración.', 4.900300::numeric, -75.883100::numeric, true, false),
    ('Panela y Miga — Demo', 'demo-panela-y-miga', 'Panadería ficticia con panes, desayunos y productos horneados. Datos creados únicamente para demostración.', 4.899200::numeric, -75.881900::numeric, false, false),
    ('Estudio Luna — Demo', 'demo-estudio-luna', 'Salón de belleza ficticio con atención integral. Datos creados únicamente para demostración.', 4.898700::numeric, -75.882700::numeric, true, true),
    ('Barbería El Parque — Demo', 'demo-barberia-el-parque', 'Barbería ficticia de estilo clásico y moderno. Datos creados únicamente para demostración.', 4.900700::numeric, -75.882000::numeric, false, false),
    ('Esencia Spa Local — Demo', 'demo-esencia-spa-local', 'Espacio ficticio de cuidado personal y relajación. Datos creados únicamente para demostración.', 4.899600::numeric, -75.884000::numeric, false, false),
    ('Conta Claro — Demo', 'demo-conta-claro', 'Asesoría contable ficticia para personas y pequeños negocios. Datos creados únicamente para demostración.', 4.898900::numeric, -75.881500::numeric, true, false),
    ('Impulso Creativo — Demo', 'demo-impulso-creativo', 'Estudio ficticio de diseño y comunicación digital. Datos creados únicamente para demostración.', 4.901100::numeric, -75.883400::numeric, false, false),
    ('Moda Cauce — Demo', 'demo-moda-cauce', 'Tienda ficticia de prendas casuales y básicos. Datos creados únicamente para demostración.', 4.899000::numeric, -75.883500::numeric, false, false),
    ('Accesorios Aurora — Demo', 'demo-accesorios-aurora', 'Emprendimiento ficticio de accesorios hechos a mano. Datos creados únicamente para demostración.', 4.900100::numeric, -75.881600::numeric, true, false),
    ('Punto Digital Virginia — Demo', 'demo-punto-digital-virginia', 'Tienda ficticia de accesorios tecnológicos y soporte básico. Datos creados únicamente para demostración.', 4.898600::numeric, -75.883000::numeric, true, true),
    ('Tecno Soluciones Risaralda — Demo', 'demo-tecno-soluciones-risaralda', 'Servicio técnico ficticio para computadores y redes. Datos creados únicamente para demostración.', 4.901300::numeric, -75.882300::numeric, false, false),
    ('Bienestar Vital — Demo', 'demo-bienestar-vital', 'Centro ficticio de hábitos saludables y bienestar. Datos creados únicamente para demostración.', 4.899400::numeric, -75.880900::numeric, true, false),
    ('Movimiento Saludable — Demo', 'demo-movimiento-saludable', 'Espacio ficticio de actividad física guiada. Datos creados únicamente para demostración.', 4.900900::numeric, -75.884100::numeric, false, false),
    ('Casa y Color — Demo', 'demo-casa-y-color', 'Tienda ficticia de decoración y artículos para el hogar. Datos creados únicamente para demostración.', 4.898400::numeric, -75.882100::numeric, true, false),
    ('Detalles del Hogar — Demo', 'demo-detalles-del-hogar', 'Taller ficticio de decoración personalizada. Datos creados únicamente para demostración.', 4.901500::numeric, -75.883000::numeric, false, false),
    ('Aula Abierta — Demo', 'demo-aula-abierta', 'Centro ficticio de refuerzo escolar y acompañamiento académico. Datos creados únicamente para demostración.', 4.899700::numeric, -75.884500::numeric, true, false),
    ('Crece Academia — Demo', 'demo-crece-academia', 'Academia ficticia de habilidades prácticas y digitales. Datos creados únicamente para demostración.', 4.900500::numeric, -75.880800::numeric, false, false)
)
insert into public.businesses (
  owner_id, name, slug, description, address, latitude, longitude,
  status, is_verified, is_featured
)
select
  demo_owner.id, seed.name, seed.slug, seed.description,
  'Ubicación de demostración, La Virginia', seed.latitude, seed.longitude,
  'approved', seed.verified, seed.featured
from seed cross join demo_owner
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  status = excluded.status,
  is_verified = excluded.is_verified,
  is_featured = excluded.is_featured;

with assignments (business_slug, category_slug) as (
  values
    ('demo-cafe-rio-dulce', 'comida-bebidas'),
    ('demo-sabores-del-puente', 'comida-bebidas'),
    ('demo-panela-y-miga', 'comida-bebidas'),
    ('demo-estudio-luna', 'belleza-cuidado-personal'),
    ('demo-barberia-el-parque', 'belleza-cuidado-personal'),
    ('demo-esencia-spa-local', 'belleza-cuidado-personal'),
    ('demo-conta-claro', 'servicios-profesionales'),
    ('demo-impulso-creativo', 'servicios-profesionales'),
    ('demo-moda-cauce', 'moda-accesorios'),
    ('demo-accesorios-aurora', 'moda-accesorios'),
    ('demo-punto-digital-virginia', 'tecnologia'),
    ('demo-tecno-soluciones-risaralda', 'tecnologia'),
    ('demo-bienestar-vital', 'salud-bienestar'),
    ('demo-movimiento-saludable', 'salud-bienestar'),
    ('demo-casa-y-color', 'hogar-decoracion'),
    ('demo-detalles-del-hogar', 'hogar-decoracion'),
    ('demo-aula-abierta', 'educacion-formacion'),
    ('demo-crece-academia', 'educacion-formacion')
)
insert into public.business_categories (business_id, category_id, is_primary)
select businesses.id, categories.id, true
from assignments
join public.businesses on businesses.slug = assignments.business_slug
join public.categories on categories.slug = assignments.category_slug
on conflict (business_id, category_id) do update set is_primary = true;

insert into public.business_hours (business_id, day_of_week, opens_at, closes_at, is_closed)
select businesses.id, days.day_of_week, '08:00'::time, '18:00'::time, false
from public.businesses
cross join generate_series(1, 6) as days(day_of_week)
where businesses.slug like 'demo-%'
  and not exists (
    select 1 from public.business_hours
    where business_hours.business_id = businesses.id
      and business_hours.day_of_week = days.day_of_week
  );

with seed (business_slug, name, description, price) as (
  values
    ('demo-cafe-rio-dulce', 'Café especial', 'Bebida caliente de demostración.', 7500::numeric),
    ('demo-sabores-del-puente', 'Almuerzo del día', 'Plato casero de demostración.', 18000::numeric),
    ('demo-panela-y-miga', 'Canasta de panes', 'Selección horneada de demostración.', 12000::numeric),
    ('demo-estudio-luna', 'Kit de cuidado capilar', 'Producto ficticio para el cuidado diario.', 32000::numeric),
    ('demo-barberia-el-parque', 'Cera para peinar', 'Producto ficticio de acabado medio.', 24000::numeric),
    ('demo-esencia-spa-local', 'Vela aromática', 'Artículo ficticio para relajación.', 28000::numeric),
    ('demo-conta-claro', 'Plantilla de presupuesto', 'Recurso digital ficticio para emprendedores.', 15000::numeric),
    ('demo-impulso-creativo', 'Paquete de plantillas', 'Recursos gráficos ficticios para redes.', 45000::numeric),
    ('demo-moda-cauce', 'Camiseta básica', 'Prenda ficticia disponible en varias tallas.', 39000::numeric),
    ('demo-accesorios-aurora', 'Aretes Aurora', 'Accesorio ficticio elaborado a mano.', 22000::numeric),
    ('demo-punto-digital-virginia', 'Cable de carga', 'Accesorio tecnológico ficticio.', 18000::numeric),
    ('demo-tecno-soluciones-risaralda', 'Kit de limpieza', 'Kit ficticio para equipos de cómputo.', 26000::numeric),
    ('demo-bienestar-vital', 'Agenda de hábitos', 'Agenda ficticia para seguimiento semanal.', 21000::numeric),
    ('demo-movimiento-saludable', 'Banda elástica', 'Accesorio ficticio para entrenamiento.', 25000::numeric),
    ('demo-casa-y-color', 'Cojín decorativo', 'Artículo ficticio para el hogar.', 42000::numeric),
    ('demo-detalles-del-hogar', 'Organizador artesanal', 'Pieza ficticia de organización.', 35000::numeric),
    ('demo-aula-abierta', 'Guía de estudio', 'Material educativo ficticio.', 16000::numeric),
    ('demo-crece-academia', 'Cuaderno de práctica', 'Material ficticio para talleres.', 14000::numeric)
)
insert into public.products (business_id, name, description, price, is_available)
select businesses.id, seed.name, seed.description, seed.price, true
from seed join public.businesses on businesses.slug = seed.business_slug
where not exists (
  select 1 from public.products
  where products.business_id = businesses.id and products.name = seed.name
);

with seed (business_slug, name, description, price) as (
  values
    ('demo-cafe-rio-dulce', 'Mesa de degustación', 'Experiencia ficticia para dos personas.', 30000::numeric),
    ('demo-sabores-del-puente', 'Menú para eventos', 'Servicio ficticio sujeto a cotización.', null::numeric),
    ('demo-panela-y-miga', 'Desayuno a domicilio', 'Servicio ficticio en zona urbana.', 22000::numeric),
    ('demo-estudio-luna', 'Corte y peinado', 'Servicio ficticio con cita previa.', 35000::numeric),
    ('demo-barberia-el-parque', 'Corte clásico', 'Servicio ficticio de barbería.', 25000::numeric),
    ('demo-esencia-spa-local', 'Sesión de relajación', 'Servicio ficticio de 45 minutos.', 60000::numeric),
    ('demo-conta-claro', 'Asesoría inicial', 'Consulta contable ficticia de una hora.', 70000::numeric),
    ('demo-impulso-creativo', 'Diseño de identidad', 'Servicio creativo ficticio.', 180000::numeric),
    ('demo-moda-cauce', 'Asesoría de estilo', 'Orientación ficticia para combinar prendas.', 40000::numeric),
    ('demo-accesorios-aurora', 'Diseño personalizado', 'Creación ficticia bajo pedido.', 50000::numeric),
    ('demo-punto-digital-virginia', 'Configuración de celular', 'Servicio técnico ficticio.', 30000::numeric),
    ('demo-tecno-soluciones-risaralda', 'Mantenimiento preventivo', 'Servicio ficticio para computador.', 75000::numeric),
    ('demo-bienestar-vital', 'Sesión de hábitos', 'Acompañamiento ficticio individual.', 55000::numeric),
    ('demo-movimiento-saludable', 'Clase funcional', 'Clase ficticia para principiantes.', 20000::numeric),
    ('demo-casa-y-color', 'Asesoría de decoración', 'Servicio ficticio para un espacio.', 80000::numeric),
    ('demo-detalles-del-hogar', 'Personalización', 'Servicio ficticio para piezas decorativas.', 30000::numeric),
    ('demo-aula-abierta', 'Refuerzo escolar', 'Sesión educativa ficticia de una hora.', 30000::numeric),
    ('demo-crece-academia', 'Taller digital', 'Taller ficticio de herramientas básicas.', 45000::numeric)
)
insert into public.services (business_id, name, description, price, is_available)
select businesses.id, seed.name, seed.description, seed.price, true
from seed join public.businesses on businesses.slug = seed.business_slug
where not exists (
  select 1 from public.services
  where services.business_id = businesses.id and services.name = seed.name
);

with seed (business_slug, title, description) as (
  values
    ('demo-cafe-rio-dulce', '2 cafés por precio especial', 'Promoción ficticia para demostrar el módulo de promociones.'),
    ('demo-estudio-luna', 'Semana de renovación', 'Promoción ficticia con descuento en servicios seleccionados.'),
    ('demo-conta-claro', 'Primera consulta con descuento', 'Promoción ficticia para nuevos emprendimientos.'),
    ('demo-moda-cauce', 'Descuento en segunda prenda', 'Promoción ficticia en referencias seleccionadas.'),
    ('demo-punto-digital-virginia', 'Accesorios al 15 %', 'Promoción ficticia por tiempo limitado.'),
    ('demo-bienestar-vital', 'Sesión inicial especial', 'Promoción ficticia para nuevos usuarios.'),
    ('demo-casa-y-color', 'Renueva tu espacio', 'Promoción ficticia en artículos decorativos.'),
    ('demo-aula-abierta', 'Primera clase de prueba', 'Promoción educativa ficticia.')
)
insert into public.promotions (
  business_id, title, description, starts_at, ends_at, is_active
)
select
  businesses.id, seed.title, seed.description,
  now() - interval '7 days', now() + interval '30 days', true
from seed join public.businesses on businesses.slug = seed.business_slug
where not exists (
  select 1 from public.promotions
  where promotions.business_id = businesses.id and promotions.title = seed.title
);
