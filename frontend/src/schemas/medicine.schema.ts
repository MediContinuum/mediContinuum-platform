import { z } from "zod";

export const medicineSchema = z.object({
  name: z.string().trim().min(2, "Medicine name is required"),
  genericName: z.string().trim().optional(),
  brandName: z.string().trim().optional(),
  description: z.string().trim().optional(),
  manufacturer: z.string().trim().optional(),
  dosageForm: z.string().trim().min(1, "Dosage form is required"),
  strength: z.string().trim().min(1, "Medicine strength is required"),
});

export const updateMedicineSchema = medicineSchema.partial();

export const medicineStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type MedicineFormValues = z.infer<typeof medicineSchema>;
export type UpdateMedicineFormValues = z.infer<typeof updateMedicineSchema>;
export type MedicineStatusFormValues = z.infer<typeof medicineStatusSchema>;
