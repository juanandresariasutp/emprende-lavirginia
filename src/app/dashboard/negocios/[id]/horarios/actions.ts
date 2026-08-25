"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ScheduleState = {
  status: "idle" | "error" | "success";
  message: string;
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function saveSchedule(
  businessId: string,
  _previousState: ScheduleState,
  formData: FormData,
): Promise<ScheduleState> {
  const schedules = Array.from({ length: 7 }, (_, day) => {
    const isClosed = formData.get(`day-${day}-closed`) === "on";
    const opensAt = String(formData.get(`day-${day}-opens`) ?? "");
    const closesAt = String(formData.get(`day-${day}-closes`) ?? "");

    return {
      day_of_week: day,
      opens_at: isClosed ? null : opensAt,
      closes_at: isClosed ? null : closesAt,
      is_closed: isClosed,
    };
  });

  const invalidSchedule = schedules.some(
    (schedule) =>
      !schedule.is_closed &&
      (!schedule.opens_at ||
        !schedule.closes_at ||
        !timePattern.test(schedule.opens_at) ||
        !timePattern.test(schedule.closes_at) ||
        schedule.opens_at >= schedule.closes_at),
  );

  if (invalidSchedule) {
    return {
      status: "error",
      message:
        "Cada día abierto necesita una hora de apertura anterior a la hora de cierre.",
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      status: "error",
      message: "Tu sesión venció. Ingresa nuevamente.",
    };
  }

  const { error } = await supabase.rpc("replace_business_hours", {
    p_business_id: businessId,
    p_schedules: schedules,
  });

  if (error) {
    return {
      status: "error",
      message:
        "No fue posible guardar los horarios. Verifica los datos e inténtalo nuevamente.",
    };
  }

  revalidatePath(`/dashboard/negocios/${businessId}/horarios`);
  revalidatePath("/mapa");

  return {
    status: "success",
    message: "Horario semanal guardado correctamente.",
  };
}
