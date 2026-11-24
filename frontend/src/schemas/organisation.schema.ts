import { z } from "zod";

export const organisationSchema = z.object({
  name: z.string().trim().min(2, "Organisation name is required"),
  description: z.string().trim().optional(),
  email: z.email("Enter a valid email address").or(z.literal("")).optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().optional(),
});

export const updateOrganisationSchema = organisationSchema.partial();

export const addOrganisationMemberSchema = z.object({
  userId: z.uuid("Enter a valid user ID"),
  role: z.string().trim().min(1, "Member role is required"),
});

export type OrganisationFormValues = z.infer<typeof organisationSchema>;
export type UpdateOrganisationFormValues = z.infer<
  typeof updateOrganisationSchema
>;
export type AddOrganisationMemberFormValues = z.infer<
  typeof addOrganisationMemberSchema
>;
