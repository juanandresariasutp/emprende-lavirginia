"use client";

import { useActionState } from "react";

import {
  saveSchedule,
  type ScheduleState,
} from "@/app/dashboard/negocios/[id]/horarios/actions";
import { Button } from "@/components/ui/button";
import type { BusinessHour } from "@/lib/business-hours";

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const initialState: ScheduleState = { status: "idle", message: "" };

type BusinessScheduleFormProps = {
  businessId: string;
  schedules: BusinessHour[];
};

export function BusinessScheduleForm({
  businessId,
  schedules,
}: BusinessScheduleFormProps) {
  const action = saveSchedule.bind(null, businessId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {days.map((day, dayIndex) => {
        const schedule = schedules.find(
          (item) => item.day_of_week === dayIndex,
        );
        const isClosed = schedule?.is_closed ?? true;

        return (
          <fieldset
            key={day}
            className="border-border grid gap-4 rounded-xl border p-4 sm:grid-cols-[8rem_1fr_1fr_auto] sm:items-end"
          >
            <legend className="sr-only">Horario del {day}</legend>
            <strong className="text-foreground self-center text-sm">
              {day}
            </strong>
            <label className="text-muted-foreground text-xs font-medium">
              Abre
              <input
                name={`day-${dayIndex}-opens`}
                type="time"
                defaultValue={schedule?.opens_at?.slice(0, 5) ?? "08:00"}
                disabled={pending}
                className="border-input bg-background text-foreground mt-1 h-10 w-full rounded-lg border px-3 text-sm"
              />
            </label>
            <label className="text-muted-foreground text-xs font-medium">
              Cierra
              <input
                name={`day-${dayIndex}-closes`}
                type="time"
                defaultValue={schedule?.closes_at?.slice(0, 5) ?? "18:00"}
                disabled={pending}
                className="border-input bg-background text-foreground mt-1 h-10 w-full rounded-lg border px-3 text-sm"
              />
            </label>
            <label className="text-foreground flex h-10 items-center gap-2 text-sm">
              <input
                name={`day-${dayIndex}-closed`}
                type="checkbox"
                defaultChecked={isClosed}
                disabled={pending}
                className="accent-primary size-4"
              />
              Cerrado
            </label>
          </fieldset>
        );
      })}

      {state.status !== "idle" ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-lg p-3 text-sm ${
            state.status === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Guardando…" : "Guardar horarios"}
        </Button>
      </div>
    </form>
  );
}
