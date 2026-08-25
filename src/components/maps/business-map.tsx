"use client";

import { LocateFixed, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const visitorMarkerRef = useRef<import("leaflet").CircleMarker | null>(null);
  const [visitorLocation, setVisitorLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "requesting" | "success" | "error"
  >("idle");
  const [locationMessage, setLocationMessage] = useState(
    "Comparte tu ubicación para encontrar los negocios más cercanos.",
  );

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
      mapRef.current = map;

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
      mapRef.current = null;
      map?.remove();
    };
  }, [businesses]);

  useEffect(() => {
    if (!visitorLocation || !mapRef.current) return;

    let disposed = false;

    void import("leaflet").then((leaflet) => {
      if (disposed || !mapRef.current) return;

      visitorMarkerRef.current?.remove();
      visitorMarkerRef.current = leaflet
        .circleMarker(
          [visitorLocation.latitude, visitorLocation.longitude],
          {
            radius: 10,
            color: "#ffffff",
            weight: 3,
            fillColor: "#2563eb",
            fillOpacity: 1,
          },
        )
        .bindTooltip("Tu ubicación", { permanent: false })
        .addTo(mapRef.current);

      mapRef.current.flyTo(
        [visitorLocation.latitude, visitorLocation.longitude],
        15,
      );
    });

    return () => {
      disposed = true;
    };
  }, [visitorLocation]);

  function requestVisitorLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("error");
      setLocationMessage(
        "Tu navegador no permite obtener la ubicación. Puedes seguir explorando el mapa.",
      );
      return;
    }

    setLocationStatus("requesting");
    setLocationMessage("Esperando permiso para obtener tu ubicación…");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setVisitorLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setLocationStatus("success");
        setLocationMessage("Ubicación obtenida correctamente.");
      },
      (error) => {
        setLocationStatus("error");
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? "No compartiste tu ubicación. Puedes seguir usando el mapa normalmente."
            : "No fue posible obtener tu ubicación. Intenta nuevamente.",
        );
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${locationStatus === "error" ? "text-destructive" : "text-muted-foreground"}`}
        >
          {locationMessage}
        </p>
        <button
          type="button"
          onClick={requestVisitorLocation}
          disabled={locationStatus === "requesting"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shrink-0",
          )}
        >
          {locationStatus === "requesting" ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <LocateFixed aria-hidden="true" className="size-4" />
          )}
          {locationStatus === "success"
            ? "Actualizar ubicación"
            : "Usar mi ubicación"}
        </button>
      </div>
      <div
        ref={containerRef}
        aria-label="Mapa de negocios de La Virginia"
        className="h-[32rem] w-full rounded-2xl"
      />
    </div>
  );
}
