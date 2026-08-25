insert into public.categories (name, slug, description, sort_order)
values
  ('Comida y bebidas', 'comida-bebidas', 'Restaurantes, cafeterías, repostería y sabores locales.', 10),
  ('Belleza y cuidado personal', 'belleza-cuidado-personal', 'Peluquerías, barberías, estética y bienestar personal.', 20),
  ('Servicios profesionales', 'servicios-profesionales', 'Soluciones profesionales para personas y negocios.', 30),
  ('Moda y accesorios', 'moda-accesorios', 'Ropa, calzado, accesorios y propuestas de diseño local.', 40),
  ('Tecnología', 'tecnologia', 'Equipos, soporte técnico y servicios digitales.', 50),
  ('Salud y bienestar', 'salud-bienestar', 'Servicios y productos para cuidar tu salud y bienestar.', 60),
  ('Hogar y decoración', 'hogar-decoracion', 'Productos y servicios para renovar y cuidar tu hogar.', 70),
  ('Educación y formación', 'educacion-formacion', 'Cursos, asesorías y oportunidades para aprender.', 80)
on conflict (slug) do nothing;
