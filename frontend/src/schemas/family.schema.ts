import { z } from "zod";

export const familyRelationshipSchema = z.enum([
  "PARENT",
  "CHILD",
  "SPOUSE",
  "SIBLING",
  "GRANDPARENT",
  "GRANDCHILD",
  "OTHER",
]);

export const createFamilyConnectionSchema = z.object({
  relatedUserGlobalId: z
    .string()
    .trim()
    .regex(/^\d{16}$/, "Enter a valid 16-digit Global User ID"),
  relationship: familyRelationshipSchema,
});

export const familyPermissionSchema = z.object({
  permission: z.string().trim().min(1, "Permission is required"),
  granted: z.boolean(),
});

export const updateFamilyPermissionsSchema = z.object({
  permissions: z
    .array(familyPermissionSchema)
    .min(1, "At least one permission is required"),
});

export type CreateFamilyConnectionFormValues = z.infer<
  typeof createFamilyConnectionSchema
>;
export type FamilyPermissionFormValues = z.infer<typeof familyPermissionSchema>;
export type UpdateFamilyPermissionsFormValues = z.infer<
  typeof updateFamilyPermissionsSchema
>;
