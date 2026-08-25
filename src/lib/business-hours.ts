export type BusinessHour = {
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
};

const weekdayNumbers: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const bogotaClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Bogota",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function isBusinessOpenNow(schedules: BusinessHour[], now = new Date()) {
  const parts = bogotaClock.formatToParts(now);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);

  if (!weekday || Number.isNaN(hour) || Number.isNaN(minute)) return false;

  const day = weekdayNumbers[weekday];
  const currentMinutes = hour * 60 + minute;

  return schedules.some(
    (schedule) =>
      schedule.day_of_week === day &&
      !schedule.is_closed &&
      schedule.opens_at !== null &&
      schedule.closes_at !== null &&
      currentMinutes >= timeToMinutes(schedule.opens_at) &&
      currentMinutes < timeToMinutes(schedule.closes_at),
  );
}
