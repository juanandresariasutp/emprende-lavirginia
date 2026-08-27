import { describe, expect, it } from "vitest";

import {
  formatCurrencyCop,
  formatLongDate,
  formatShortDate,
  formatTime12Hour,
} from "./formatters";

describe("formatters", () => {
  it("formatea valores monetarios en pesos colombianos", () => {
    expect(formatCurrencyCop(12_500).replace(/\s/g, " ")).toBe("$ 12.500");
  });

  it("formatea fechas cortas y largas en español", () => {
    const date = "2026-08-30T12:00:00Z";
    expect(formatShortDate(date)).toBe("30 de agosto");
    expect(formatLongDate(date)).toBe("30 de agosto de 2026");
  });

  it("convierte horas de 24 a 12 horas", () => {
    expect(formatTime12Hour("00:05")).toBe("12:05 a. m.");
    expect(formatTime12Hour("13:30")).toBe("1:30 p. m.");
  });
});
