const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginField = "email" | "password";
export type RegisterOwnerField =
  "fullName" | "email" | "password" | "confirmPassword" | "terms";
export type ProductField = "name" | "description" | "price";

function safeNextPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "");
  return path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";
}

export function parseLoginForm(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fieldErrors: Partial<Record<LoginField, string>> = {};

  if (!emailPattern.test(email) || email.length > 254) {
    fieldErrors.email = "Escribe un correo electrónico válido.";
  }
  if (!password) fieldErrors.password = "Escribe tu contraseña.";

  return {
    input: {
      email,
      password,
      nextPath: safeNextPath(formData.get("next")),
    },
    fieldErrors,
  };
}

export function parseRegisterOwnerForm(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const acceptedTerms = formData.get("terms") === "on";
  const fieldErrors: Partial<Record<RegisterOwnerField, string>> = {};

  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = "Escribe un nombre de entre 2 y 120 caracteres.";
  }
  if (!emailPattern.test(email) || email.length > 254) {
    fieldErrors.email = "Escribe un correo electrónico válido.";
  }
  if (password.length < 8 || password.length > 72) {
    fieldErrors.password = "La contraseña debe tener entre 8 y 72 caracteres.";
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Las contraseñas no coinciden.";
  }
  if (!acceptedTerms) {
    fieldErrors.terms = "Debes aceptar los términos para continuar.";
  }

  return { input: { fullName, email, password }, fieldErrors };
}

export function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const descriptionValue = String(formData.get("description") ?? "").trim();
  const description = descriptionValue || null;
  const priceText = String(formData.get("price") ?? "").trim();
  const price = Number(priceText);
  const isAvailable = formData.get("isAvailable") === "on";
  const fieldErrors: Partial<Record<ProductField, string>> = {};

  if (name.length < 2 || name.length > 120) {
    fieldErrors.name = "Escribe un nombre de entre 2 y 120 caracteres.";
  }
  if (description && description.length > 2000) {
    fieldErrors.description =
      "La descripción no puede superar 2000 caracteres.";
  }
  if (
    !priceText ||
    !Number.isFinite(price) ||
    price < 0 ||
    price > 9_999_999_999.99
  ) {
    fieldErrors.price = "Escribe un precio válido igual o mayor que cero.";
  }

  return {
    input: { name, description, price, is_available: isAvailable },
    fieldErrors,
  };
}
