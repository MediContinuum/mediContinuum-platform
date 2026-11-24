import { z } from "zod";

const genderSchema = z.enum(["MALE", "FEMALE", "OTHER"]);

const bloodGroupSchema = z.enum([
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);

const patientFields = {
  dateOfBirth: z.iso.date("Enter a valid date of birth"),
  gender: genderSchema,
  bloodGroup: bloodGroupSchema,
  addressLine: z.string().trim().min(3, "Address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  country: z.string().trim().min(2, "Country is required"),
  postalCode: z.string().trim().min(3, "Postal code is required"),
  emergencyContactName: z
    .string()
    .trim()
    .min(2, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid emergency contact number"),
};

export const createPatientSchema = z.object({
  globalUserId: z
    .string()
    .trim()
    .regex(/^\d{16}$/, "Global User ID must contain 16 digits"),
  ...patientFields,
});

export const updatePatientSchema = z.object(patientFields);

export type CreatePatientFormValues = z.infer<typeof createPatientSchema>;
export type UpdatePatientFormValues = z.infer<typeof updatePatientSchema>;
