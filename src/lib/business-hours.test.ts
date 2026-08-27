import { describe, expect, it } from "vitest";

import { isBusinessOpenNow, type BusinessHour } from "./business-hours";

const mondaySchedule: BusinessHour[] = [
  {
    day_of_week: 1,
    opens_at: "09:00",
    closes_at: "17:00",
    is_closed: false,
  },
];

describe("isBusinessOpenNow", () => {
  it("usa la hora de Bogotá para determinar si está abierto", () => {
    expect(
      isBusinessOpenNow(mondaySchedule, new Date("2026-08-31T15:00:00Z")),
    ).toBe(true);
  });

  it("considera la hora de cierre como fuera del horario", () => {
    expect(
      isBusinessOpenNow(mondaySchedule, new Date("2026-08-31T22:00:00Z")),
    ).toBe(false);
  });

  it("respeta los días marcados como cerrados", () => {
    expect(
      isBusinessOpenNow(
        [{ ...mondaySchedule[0], is_closed: true }],
        new Date("2026-08-31T15:00:00Z"),
      ),
    ).toBe(false);
  });
});
