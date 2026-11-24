import { z } from "zod";

/**
 * Validates an email address.
 */
export const emailValidator = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

/**
 * Validates a password.
 */
export const passwordValidator = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

/**
 * Generic international phone validation.
 * This checks common international phone formats, not ownership.
 */
export const phoneValidator = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid international phone number");

/**
 * Validates UUID values.
 */
export const uuidValidator = z.uuid("Enter a valid ID");

/**
 * Validates ISO date strings: YYYY-MM-DD.
 */
export const isoDateValidator = z.iso.date("Enter a valid date");

/**
 * Validates ISO datetime strings.
 */
export const isoDateTimeValidator = z.iso.datetime({
  offset: true,
  message: "Enter a valid date and time",
});

/**
 * Validates a timezone using the IANA timezone database.
 */
export const timeZoneValidator = z
  .string()
  .trim()
  .min(1, "Timezone is required")
  .refine((value) => {
    try {
      new Intl.DateTimeFormat("en-US", {
        timeZone: value,
      });

      return true;
    } catch {
      return false;
    }
  }, "Enter a valid IANA timezone");

/**
 * Creates a reusable required string validator.
 */
export function createRequiredStringValidator(
  fieldName: string,
  minLength = 1,
  maxLength = 255,
) {
  return z
    .string()
    .trim()
    .min(minLength, `${fieldName} is required`)
    .max(maxLength, `${fieldName} cannot exceed ${maxLength} characters`);
}

/**
 * Creates a reusable optional string validator.
 */
export function createOptionalStringValidator(maxLength = 255) {
  return z
    .string()
    .trim()
    .max(maxLength, `Cannot exceed ${maxLength} characters`)
    .optional()
    .or(z.literal(""));
}

/**
 * Validates a positive numeric value.
 */
export const positiveNumberValidator = z
  .number()
  .finite("Enter a valid number")
  .positive("Value must be greater than zero");

/**
 * Validates a non-negative numeric value.
 */
export const nonNegativeNumberValidator = z
  .number()
  .finite("Enter a valid number")
  .min(0, "Value cannot be negative");

/**
 * Validates a Global User ID.
 * The 16-digit format follows the IDs in the supplied API examples.
 */
export const globalUserIdValidator = z
  .string()
  .trim()
  .regex(/^\d{16}$/, "Global User ID must contain 16 digits");

/**
 * Validates data against any Zod schema.
 */
export function validateWithSchema<T extends z.ZodType>(
  schema: T,
  value: unknown,
) {
  return schema.safeParse(value);
}

/**
 * Returns field-level errors from a Zod validation error.
 */
export function getZodFieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors;
}

/**
 * Checks whether a value passes a Zod schema.
 */
export function isValidWithSchema<T extends z.ZodType>(
  schema: T,
  value: unknown,
): boolean {
  return schema.safeParse(value).success;
}
