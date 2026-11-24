import { format, formatDistance, isValid } from "date-fns";
import { TZDate, tz } from "@date-fns/tz";

export type DateInput = Date | string | number;

export const DEFAULT_TIME_ZONE = "UTC";

export const DATE_FORMATS = {
  DATE: "dd MMM yyyy",
  DATE_SHORT: "dd/MM/yyyy",
  DATE_LONG: "EEEE, dd MMMM yyyy",
  TIME: "hh:mm a",
  TIME_24_HOUR: "HH:mm",
  DATE_TIME: "dd MMM yyyy, hh:mm a",
  DATE_TIME_24_HOUR: "dd MMM yyyy, HH:mm",
} as const;

/**
 * Converts an input into a Date/TZDate.
 *
 * Date-only strings are treated as calendar dates in the
 * supplied timezone, not as UTC instants.
 *
 * ISO timestamps containing Z or an offset represent instants.
 */
function parseDateInput(value: DateInput, timeZone: string): Date | TZDate {
  if (typeof value === "number" || value instanceof Date) {
    return value instanceof Date ? value : new Date(value);
  }

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return new TZDate(Number(year), Number(month) - 1, Number(day), timeZone);
  }

  const localDateTimeMatch = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/,
  );

  if (localDateTimeMatch) {
    const [, year, month, day, hours, minutes, seconds = "0", fraction = "0"] =
      localDateTimeMatch;

    const milliseconds = Number(fraction.padEnd(3, "0").slice(0, 3));

    return new TZDate(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
      milliseconds,
      timeZone,
    );
  }

  return new Date(value);
}

function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone,
    });

    return true;
  } catch {
    return false;
  }
}

function getTimeZone(timeZone?: string): string {
  if (!timeZone) {
    return DEFAULT_TIME_ZONE;
  }

  return isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIME_ZONE;
}

/**
 * Formats a date according to the user's timezone.
 */
export function formatDate(
  value: DateInput | null | undefined,
  timeZone = DEFAULT_TIME_ZONE,
  pattern: string = DATE_FORMATS.DATE,
): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  try {
    const zone = getTimeZone(timeZone);
    const date = parseDateInput(value, zone);

    if (!isValid(date)) {
      return "—";
    }

    return format(date, pattern, {
      in: tz(zone),
    });
  } catch {
    return "—";
  }
}

/**
 * Formats date and time in the specified timezone.
 */
export function formatDateTime(
  value: DateInput | null | undefined,
  timeZone = DEFAULT_TIME_ZONE,
  use24Hour = false,
): string {
  return formatDate(
    value,
    timeZone,
    use24Hour ? DATE_FORMATS.DATE_TIME_24_HOUR : DATE_FORMATS.DATE_TIME,
  );
}

/**
 * Formats only the time portion.
 */
export function formatTime(
  value: DateInput | null | undefined,
  timeZone = DEFAULT_TIME_ZONE,
  use24Hour = false,
): string {
  return formatDate(
    value,
    timeZone,
    use24Hour ? DATE_FORMATS.TIME_24_HOUR : DATE_FORMATS.TIME,
  );
}

/**
 * Returns a human-readable relative date.
 */
export function formatRelativeDate(
  value: DateInput | null | undefined,
  timeZone = DEFAULT_TIME_ZONE,
): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  try {
    const zone = getTimeZone(timeZone);
    const date = parseDateInput(value, zone);

    if (!isValid(date)) {
      return "—";
    }

    return formatDistance(date, new Date(), {
      addSuffix: true,
      in: tz(zone),
    });
  } catch {
    return "—";
  }
}

/**
 * Returns the date in YYYY-MM-DD format in the given timezone.
 */
export function formatDateForInput(
  value: DateInput | null | undefined,
  timeZone = DEFAULT_TIME_ZONE,
): string {
  return formatDate(value, timeZone, "yyyy-MM-dd");
}

/**
 * Gets the user's IANA timezone from the browser.
 * Falls back to UTC if unavailable.
 */
export function getBrowserTimeZone(): string {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIME_ZONE
    );
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}
