"use client";

import { useEffect, useRef } from "react";

const LA_VIRGINIA_CENTER: [number, number] = [4.89972, -75.8825];

export function BusinessMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | undefined;

    void import("leaflet").then((leaflet) => {
      if (disposed || !containerRef.current) return;

      map = leaflet
        .map(containerRef.current, {
          scrollWheelZoom: false,
        })
        .setView(LA_VIRGINIA_CENTER, 14);

      leaflet
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        })
        .addTo(map);
    });

    return () => {
      disposed = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label="Mapa de negocios de La Virginia"
      className="h-[32rem] w-full rounded-2xl"
    />
  );
}
