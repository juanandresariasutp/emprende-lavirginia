import { describe, expect, it } from "vitest";

import { calculateDistanceKm, formatDistance } from "./distance";

describe("calculateDistanceKm", () => {
  it("devuelve cero para el mismo punto", () => {
    const point = { latitude: 4.89972, longitude: -75.8825 };
    expect(calculateDistanceKm(point, point)).toBe(0);
  });

  it("calcula la distancia con la fórmula de Haversine", () => {
    const distance = calculateDistanceKm(
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 1 },
    );
    expect(distance).toBeCloseTo(111.19, 1);
  });
});

describe("formatDistance", () => {
  it("usa metros por debajo de un kilómetro", () => {
    expect(formatDistance(0.347)).toBe("350 m");
  });

  it("usa kilómetros con un decimal desde un kilómetro", () => {
    expect(formatDistance(2.34)).toBe("2,3 km");
  });
});
