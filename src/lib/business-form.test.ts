import { describe, expect, it } from "vitest";

import { createBusinessSlug, parseBusinessForm } from "./business-form";

describe("parseBusinessForm", () => {
  it("normaliza un formulario válido", () => {
    const formData = new FormData();
    formData.set("name", "  Café Virginia  ");
    formData.set("phone", "+57 300 123 4567");
    formData.set("website", "https://cafe.example.com");
    formData.set("latitude", "4.89972");
    formData.set("longitude", "-75.8825");

    const result = parseBusinessForm(formData);

    expect(result.fieldErrors).toEqual({});
    expect(result.input).toMatchObject({
      name: "Café Virginia",
      phone: "+57 300 123 4567",
      description: null,
      latitude: 4.89972,
      longitude: -75.8825,
    });
  });

  it("rechaza URLs, teléfonos y coordenadas inválidas", () => {
    const formData = new FormData();
    formData.set("name", "A");
    formData.set("phone", "abc");
    formData.set("website", "javascript:alert(1)");
    formData.set("latitude", "91");

    const { fieldErrors } = parseBusinessForm(formData);

    expect(fieldErrors).toMatchObject({
      name: expect.any(String),
      phone: expect.any(String),
      website: expect.any(String),
      latitude: expect.any(String),
      longitude: expect.any(String),
    });
  });
});

describe("createBusinessSlug", () => {
  it("crea slugs seguros sin tildes ni símbolos", () => {
    expect(createBusinessSlug("  Café & Panadería La Virginia  ")).toBe(
      "cafe-panaderia-la-virginia",
    );
  });
});
