import { CalendarClock } from "lucide-react";
import type { Metadata } from "next";

import { BusinessScheduleForm } from "@/components/forms/business-schedule-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Horarios del negocio",
  robots: { index: false },
};

type SchedulePageProps = { params: Promise<{ id: string }> };

export default async function SchedulePage({ params }: SchedulePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: schedules } = await supabase
    .from("business_hours")
    .select("day_of_week, opens_at, closes_at, is_closed")
    .eq("business_id", id)
    .order("day_of_week");

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <CalendarClock aria-hidden="true" className="size-4" /> Horarios
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">
        Horario semanal
      </h1>
      <p className="text-muted-foreground mt-3 leading-7">
        Define una franja de atención por día o marca el negocio como cerrado.
      </p>
      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm sm:p-7">
        <BusinessScheduleForm businessId={id} schedules={schedules ?? []} />
      </div>
    </section>
  );
}
