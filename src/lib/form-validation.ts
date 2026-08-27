const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const localDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export type LoginField = "email" | "password";
export type RegisterOwnerField =
  | "fullName"
  | "email"
  | "password"
  | "confirmPassword"
  | "terms";
export type ProductField = "name" | "description" | "price";
export type PromotionField =
  | "title"
  | "description"
  | "imageUrl"
  | "startsAt"
  | "endsAt";

function safeNextPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "");
  return path.startsWith("/") && !path.startsWith("//")
    ? path
    : "/dashboard";
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

function colombiaDateToIso(value: string) {
  if (!localDatePattern.test(value)) return null;
  const date = new Date(`${value}:00-05:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function parsePromotionForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const descriptionValue = String(formData.get("description") ?? "").trim();
  const description = descriptionValue || null;
  const imageUrlValue = String(formData.get("imageUrl") ?? "").trim();
  const imageUrl = imageUrlValue || null;
  const startsAt = colombiaDateToIso(String(formData.get("startsAt") ?? ""));
  const endsAt = colombiaDateToIso(String(formData.get("endsAt") ?? ""));
  const isActive = formData.get("isActive") === "on";
  const fieldErrors: Partial<Record<PromotionField, string>> = {};

  if (title.length < 2 || title.length > 140) {
    fieldErrors.title = "Escribe un título de entre 2 y 140 caracteres.";
  }
  if (description && description.length > 2000) {
    fieldErrors.description =
      "La descripción no puede superar 2000 caracteres.";
  }
  if (imageUrl && (imageUrl.length > 2048 || !URL.canParse(imageUrl))) {
    fieldErrors.imageUrl = "Escribe una URL válida de máximo 2048 caracteres.";
  }
  if (!startsAt) {
    fieldErrors.startsAt = "Selecciona una fecha de inicio válida.";
  }
  if (!endsAt) {
    fieldErrors.endsAt = "Selecciona una fecha de finalización válida.";
  }
  if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
    fieldErrors.endsAt = "La finalización debe ser posterior al inicio.";
  }

  return {
    input: {
      title,
      description,
      image_url: imageUrl,
      starts_at: startsAt,
      ends_at: endsAt,
      is_active: isActive,
    },
    fieldErrors,
  };
}
