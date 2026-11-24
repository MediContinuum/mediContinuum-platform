import { z } from "zod";

export const dosageUnitSchema = z.enum([
  "TABLET",
  "CAPSULE",
  "ML",
  "MG",
  "G",
  "DROP",
  "PUFF",
  "UNIT",
]);

export const dosageFrequencySchema = z.enum([
  "ONCE_DAILY",
  "TWICE_DAILY",
  "THREE_TIMES_DAILY",
  "FOUR_TIMES_DAILY",
  "AS_NEEDED",
]);

export const prescriptionItemSchema = z
  .object({
    medicineId: z.uuid("Select a valid medicine"),
    dosageAmount: z.number().positive("Dosage must be greater than zero"),
    dosageUnit: dosageUnitSchema,
    frequency: dosageFrequencySchema,
    startDate: z.iso.date("Enter a valid start date"),
    endDate: z.iso.date("Enter a valid end date"),
    instructions: z.string().trim().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export const createPrescriptionSchema = z.object({
  patientId: z.uuid("Select a valid patient"),
  notes: z.string().trim().optional(),
  items: z
    .array(prescriptionItemSchema)
    .min(1, "At least one medicine is required"),
});

export const updatePrescriptionStatusSchema = z.object({
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]),
});

export type PrescriptionItemFormValues = z.infer<typeof prescriptionItemSchema>;
export type CreatePrescriptionFormValues = z.infer<
  typeof createPrescriptionSchema
>;
export type UpdatePrescriptionStatusFormValues = z.infer<
  typeof updatePrescriptionStatusSchema
>;
