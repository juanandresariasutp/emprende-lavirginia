import { describe, expect, it } from "vitest";

import { parseBusinessForm } from "./business-form";
import {
  parseLoginForm,
  parseProductForm,
  parsePromotionForm,
  parseRegisterOwnerForm,
} from "./form-validation";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("formulario de login", () => {
  it("normaliza el correo y conserva una redirección interna segura", () => {
    const result = parseLoginForm(
      formData({
        email: "  PERSONA@EXAMPLE.COM ",
        password: "secreto",
        next: "/dashboard/negocios/nuevo",
      }),
    );

    expect(result.fieldErrors).toEqual({});
    expect(result.input).toEqual({
      email: "persona@example.com",
      password: "secreto",
      nextPath: "/dashboard/negocios/nuevo",
    });
  });

  it("rechaza credenciales vacías y redirecciones externas", () => {
    const result = parseLoginForm(
      formData({ email: "correo-invalido", next: "//sitio-malicioso.test" }),
    );

    expect(result.fieldErrors).toMatchObject({
      email: expect.any(String),
      password: expect.any(String),
    });
    expect(result.input.nextPath).toBe("/dashboard");
  });
});

describe("formulario de registro", () => {
  it("acepta datos completos y contraseñas coincidentes", () => {
    const result = parseRegisterOwnerForm(
      formData({
        fullName: "María Pérez",
        email: "maria@example.com",
        password: "clave-segura-2026",
        confirmPassword: "clave-segura-2026",
        terms: "on",
      }),
    );

    expect(result.fieldErrors).toEqual({});
    expect(result.input.email).toBe("maria@example.com");
  });

  it("informa nombre, correo, contraseña y términos inválidos", () => {
    const result = parseRegisterOwnerForm(
      formData({
        fullName: "M",
        email: "maria",
        password: "corta",
        confirmPassword: "diferente",
      }),
    );

    expect(result.fieldErrors).toMatchObject({
      fullName: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      confirmPassword: expect.any(String),
      terms: expect.any(String),
    });
  });
});

describe("formulario de negocio", () => {
  it("acepta los datos mínimos", () => {
    const result = parseBusinessForm(formData({ name: "Tienda Local" }));
    expect(result.fieldErrors).toEqual({});
    expect(result.input.name).toBe("Tienda Local");
  });

  it("exige coordenadas completas", () => {
    const result = parseBusinessForm(
      formData({ name: "Tienda Local", latitude: "4.9" }),
    );
    expect(result.fieldErrors.latitude).toBeDefined();
    expect(result.fieldErrors.longitude).toBeDefined();
  });
});

describe("formulario de producto", () => {
  it("acepta precio cero y transforma disponibilidad", () => {
    const result = parseProductForm(
      formData({ name: "Muestra", price: "0", isAvailable: "on" }),
    );

    expect(result.fieldErrors).toEqual({});
    expect(result.input).toMatchObject({ price: 0, is_available: true });
  });

  it("rechaza nombre corto y precio negativo", () => {
    const result = parseProductForm(formData({ name: "X", price: "-1" }));
    expect(result.fieldErrors).toMatchObject({
      name: expect.any(String),
      price: expect.any(String),
    });
  });
});

describe("formulario de promoción", () => {
  it("convierte fechas locales de Colombia a ISO", () => {
    const result = parsePromotionForm(
      formData({
        title: "Descuento especial",
        startsAt: "2026-09-01T10:00",
        endsAt: "2026-09-02T18:30",
        isActive: "on",
      }),
    );

    expect(result.fieldErrors).toEqual({});
    expect(result.input.starts_at).toBe("2026-09-01T15:00:00.000Z");
    expect(result.input.ends_at).toBe("2026-09-02T23:30:00.000Z");
    expect(result.input.is_active).toBe(true);
  });

  it("rechaza URLs inválidas y fechas invertidas", () => {
    const result = parsePromotionForm(
      formData({
        title: "Promoción",
        imageUrl: "no-es-url",
        startsAt: "2026-09-02T10:00",
        endsAt: "2026-09-01T10:00",
      }),
    );

    expect(result.fieldErrors).toMatchObject({
      imageUrl: expect.any(String),
      endsAt: expect.any(String),
    });
  });
});
