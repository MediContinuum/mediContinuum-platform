import { z } from "zod";

export const appointmentStatusSchema = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const createAppointmentSchema = z
  .object({
    patientId: z.uuid("Select a valid patient"),
    doctorId: z.uuid("Select a valid doctor"),
    organisationId: z.uuid().optional(),
    appointmentDate: z.iso.date("Enter a valid appointment date"),
    startTime: z.iso.time("Enter a valid start time"),
    endTime: z.iso.time("Enter a valid end time"),
    reason: z.string().trim().min(3, "Appointment reason is required"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be later than start time",
    path: ["endTime"],
  });

export const updateAppointmentSchema = z.object({
  appointmentDate: z.iso.date().optional(),
  startTime: z.iso.time().optional(),
  endTime: z.iso.time().optional(),
  reason: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: appointmentStatusSchema,
});

export type CreateAppointmentFormValues = z.infer<
  typeof createAppointmentSchema
>;
export type UpdateAppointmentFormValues = z.infer<
  typeof updateAppointmentSchema
>;
export type AppointmentStatusFormValues = z.infer<
  typeof updateAppointmentStatusSchema
>;
