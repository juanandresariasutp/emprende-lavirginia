const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const shortDateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
});

const longDateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatCurrencyCop(value: number | string) {
  return currencyFormatter.format(Number(value));
}

export function formatShortDate(value: Date | string) {
  return shortDateFormatter.format(
    typeof value === "string" ? new Date(value) : value,
  );
}

export function formatLongDate(value: Date | string) {
  return longDateFormatter.format(
    typeof value === "string" ? new Date(value) : value,
  );
}

export function formatTime12Hour(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "p. m." : "a. m.";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
