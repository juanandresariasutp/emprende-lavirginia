const EARTH_RADIUS_KM = 6371;

type Coordinates = {
  latitude: number;
  longitude: number;
};

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function calculateDistanceKm(from: Coordinates, to: Coordinates) {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    EARTH_RADIUS_KM *
    2 *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.max(10, Math.round((distanceKm * 1000) / 10) * 10)} m`;
  }

  return `${distanceKm.toLocaleString("es-CO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} km`;
}
