"use client";

import { ArrowRight, LocateFixed, LoaderCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { calculateDistanceKm, formatDistance } from "@/lib/distance";
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
  const sortedBusinesses = useMemo(() => {
    const withDistance = businesses.map((business) => ({
      ...business,
      distanceKm: visitorLocation
        ? calculateDistanceKm(visitorLocation, business)
        : null,
    }));

    if (!visitorLocation) return withDistance;

    return withDistance.sort(
      (first, second) =>
        (first.distanceKm ?? Number.POSITIVE_INFINITY) -
        (second.distanceKm ?? Number.POSITIVE_INFINITY),
    );
  }, [businesses, visitorLocation]);

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
        const position = leaflet.latLng(business.latitude, business.longitude);

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
        .circleMarker([visitorLocation.latitude, visitorLocation.longitude], {
          radius: 10,
          color: "#ffffff",
          weight: 3,
          fillColor: "#2563eb",
          fillOpacity: 1,
        })
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
          className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
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
        role="region"
        aria-label="Mapa de negocios de La Virginia"
        className="h-[24rem] w-full rounded-2xl sm:h-[32rem]"
      />
      <div className="border-border border-t p-3 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-foreground font-bold">
              {visitorLocation ? "Más cerca de ti" : "Negocios ubicados"}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {visitorLocation
                ? "Ordenados desde tu ubicación actual."
                : "Activa tu ubicación para ordenarlos por distancia."}
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {sortedBusinesses.length} resultados
          </span>
        </div>

        {sortedBusinesses.length > 0 ? (
          <ol className="mt-4 grid gap-3 md:grid-cols-2">
            {sortedBusinesses.map((business) => (
              <li key={business.id}>
                <Link
                  href={`/negocios/${business.slug}`}
                  className="border-border hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring group flex h-full items-center gap-3 rounded-xl border p-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <MapPin aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="text-foreground block truncate text-sm">
                      {business.name}
                    </strong>
                    <span className="text-muted-foreground mt-1 block truncate text-xs">
                      {business.address ?? "La Virginia, Risaralda"}
                    </span>
                  </span>
                  {business.distanceKm !== null ? (
                    <span className="text-primary text-sm font-semibold whitespace-nowrap">
                      {formatDistance(business.distanceKm)}
                    </span>
                  ) : (
                    <ArrowRight
                      aria-hidden="true"
                      className="text-muted-foreground size-4 transition-transform group-hover:translate-x-1"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="border-border text-muted-foreground mt-4 rounded-xl border border-dashed p-6 text-center text-sm">
            Aún no hay negocios aprobados con coordenadas disponibles.
          </p>
        )}
      </div>
    </div>
  );
}
