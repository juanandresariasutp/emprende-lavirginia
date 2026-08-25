export type BusinessField =
  | "name"
  | "description"
  | "phone"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "website"
  | "address"
  | "latitude"
  | "longitude";

export type BusinessFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<BusinessField, string>>;
};

export type BusinessInput = {
  name: string;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

const phonePattern = /^[+0-9()\s-]+$/;

function optionalValue(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value || null;
}

function isValidWebUrl(value: string | null) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export function parseBusinessForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = optionalValue(formData, "description");
  const phone = optionalValue(formData, "phone");
  const whatsapp = optionalValue(formData, "whatsapp");
  const instagram = optionalValue(formData, "instagram");
  const facebook = optionalValue(formData, "facebook");
  const website = optionalValue(formData, "website");
  const address = optionalValue(formData, "address");
  const latitudeText = optionalValue(formData, "latitude");
  const longitudeText = optionalValue(formData, "longitude");
  const latitude = latitudeText === null ? null : Number(latitudeText);
  const longitude = longitudeText === null ? null : Number(longitudeText);
  const fieldErrors: BusinessFormState["fieldErrors"] = {};

  if (name.length < 2 || name.length > 120) {
    fieldErrors.name = "Escribe un nombre de entre 2 y 120 caracteres.";
  }
  if (description && description.length > 2000) {
    fieldErrors.description =
      "La descripción no puede superar 2000 caracteres.";
  }
  if (
    phone &&
    (phone.length < 7 || phone.length > 32 || !phonePattern.test(phone))
  ) {
    fieldErrors.phone = "Escribe un teléfono válido de 7 a 32 caracteres.";
  }
  if (
    whatsapp &&
    (whatsapp.length < 7 ||
      whatsapp.length > 32 ||
      !phonePattern.test(whatsapp))
  ) {
    fieldErrors.whatsapp = "Escribe un número de WhatsApp válido.";
  }
  if (instagram && instagram.length > 255) {
    fieldErrors.instagram = "Instagram no puede superar 255 caracteres.";
  }
  if (facebook && facebook.length > 255) {
    fieldErrors.facebook = "Facebook no puede superar 255 caracteres.";
  }
  if (!isValidWebUrl(website) || (website?.length ?? 0) > 2048) {
    fieldErrors.website =
      "Escribe una URL completa que comience por http:// o https://.";
  }
  if (address && address.length > 300) {
    fieldErrors.address = "La dirección no puede superar 300 caracteres.";
  }
  if ((latitudeText === null) !== (longitudeText === null)) {
    fieldErrors.latitude = "Completa las dos coordenadas o deja ambas vacías.";
    fieldErrors.longitude = "Completa las dos coordenadas o deja ambas vacías.";
  } else {
    if (
      latitude !== null &&
      (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)
    ) {
      fieldErrors.latitude = "La latitud debe estar entre -90 y 90.";
    }
    if (
      longitude !== null &&
      (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)
    ) {
      fieldErrors.longitude = "La longitud debe estar entre -180 y 180.";
    }
  }

  const input: BusinessInput = {
    name,
    description,
    phone,
    whatsapp,
    instagram,
    facebook,
    website,
    address,
    latitude,
    longitude,
  };

  return { input, fieldErrors };
}

export function createBusinessSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}
