"use client";

import { useEffect, useRef } from "react";

const LA_VIRGINIA_CENTER: [number, number] = [4.89972, -75.8825];

export type MapBusiness = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  latitude: number;
  longitude: number;
};

type BusinessMapProps = {
  businesses: MapBusiness[];
};

function createBusinessPopup(business: MapBusiness) {
  const container = document.createElement("div");
  const name = document.createElement("strong");
  const address = document.createElement("p");
  const link = document.createElement("a");

  container.className = "business-map-popup";
  name.textContent = business.name;
  address.textContent = business.address ?? "La Virginia, Risaralda";
  link.textContent = "Ver perfil";
  link.href = `/negocios/${business.slug}`;

  container.append(name, address, link);
  return container;
}

export function BusinessMap({ businesses }: BusinessMapProps) {
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

      const bounds = leaflet.latLngBounds([]);

      businesses.forEach((business) => {
        const position = leaflet.latLng(
          business.latitude,
          business.longitude,
        );

        leaflet
          .circleMarker(position, {
            radius: 9,
            color: "#ffffff",
            weight: 3,
            fillColor: "#17834f",
            fillOpacity: 1,
          })
          .bindPopup(createBusinessPopup(business), { minWidth: 190 })
          .addTo(map!);
        bounds.extend(position);
      });

      if (businesses.length > 0) {
        map.fitBounds(bounds, { padding: [36, 36], maxZoom: 16 });
      }
    });

    return () => {
      disposed = true;
      map?.remove();
    };
  }, [businesses]);

  return (
    <div
      ref={containerRef}
      aria-label="Mapa de negocios de La Virginia"
      className="h-[32rem] w-full rounded-2xl"
    />
  );
}
