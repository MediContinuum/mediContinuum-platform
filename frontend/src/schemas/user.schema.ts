import { z } from "zod";

export const userProfileSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const updateUserProfileSchema = userProfileSchema.partial();

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
export type UpdateUserProfileFormValues = z.infer<
  typeof updateUserProfileSchema
>;
