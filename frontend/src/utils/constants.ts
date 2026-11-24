/* -------------------------------------------------------------------------- */
/* APPLICATION                                                                */
/* -------------------------------------------------------------------------- */

export const APP_NAME = "MediContinuum";

export const APP_DESCRIPTION = "Connected healthcare management platform";

export const APP_VERSION = "1.0.0";

/* -------------------------------------------------------------------------- */
/* LOCALIZATION                                                               */
/* -------------------------------------------------------------------------- */

export const DEFAULT_LOCALE = "en-IN";

export const DEFAULT_CURRENCY = "INR";

export const DEFAULT_TIME_ZONE = "UTC";

/* -------------------------------------------------------------------------- */
/* DATE AND TIME                                                              */
/* -------------------------------------------------------------------------- */

export const DATE_FORMAT = {
  DATE: "dd MMM yyyy",
  DATE_SHORT: "dd/MM/yyyy",
  DATE_LONG: "EEEE, dd MMMM yyyy",
  TIME: "hh:mm a",
  TIME_24_HOUR: "HH:mm",
  DATE_TIME: "dd MMM yyyy, hh:mm a",
} as const;

/* -------------------------------------------------------------------------- */
/* PAGINATION                                                                 */
/* -------------------------------------------------------------------------- */

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

/* -------------------------------------------------------------------------- */
/* DEBOUNCE                                                                   */
/* -------------------------------------------------------------------------- */

export const DEBOUNCE = {
  SEARCH: 400,
  INPUT: 300,
  API: 500,
} as const;

/* -------------------------------------------------------------------------- */
/* MEDICINE                                                                   */
/* -------------------------------------------------------------------------- */

export const MEDICINE_DOSAGE_UNITS = [
  "TABLET",
  "CAPSULE",
  "ML",
  "MG",
  "G",
  "DROP",
  "PUFF",
  "UNIT",
] as const;

export const MEDICINE_FREQUENCIES = [
  "ONCE_DAILY",
  "TWICE_DAILY",
  "THREE_TIMES_DAILY",
  "FOUR_TIMES_DAILY",
  "AS_NEEDED",
] as const;

/* -------------------------------------------------------------------------- */
/* PATIENT                                                                    */
/* -------------------------------------------------------------------------- */

export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"] as const;

export const BLOOD_GROUP_OPTIONS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;

/* -------------------------------------------------------------------------- */
/* FAMILY                                                                     */
/* -------------------------------------------------------------------------- */

export const FAMILY_RELATIONSHIPS = [
  "PARENT",
  "CHILD",
  "SPOUSE",
  "SIBLING",
  "GRANDPARENT",
  "GRANDCHILD",
  "OTHER",
] as const;

/* -------------------------------------------------------------------------- */
/* INVENTORY                                                                  */
/* -------------------------------------------------------------------------- */

export const INVENTORY = {
  DEFAULT_LOW_STOCK_THRESHOLD: 5,
  DEFAULT_EXPIRY_WARNING_DAYS: 30,
} as const;

/* -------------------------------------------------------------------------- */
/* UI                                                                         */
/* -------------------------------------------------------------------------- */

export const UI = {
  SIDEBAR_WIDTH: 260,
  SIDEBAR_COLLAPSED_WIDTH: 72,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;

/* -------------------------------------------------------------------------- */
/* QUERY                                                                      */
/* -------------------------------------------------------------------------- */

export const QUERY = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000,
  DEFAULT_GC_TIME: 10 * 60 * 1000,
  RETRY_COUNT: 1,
} as const;
