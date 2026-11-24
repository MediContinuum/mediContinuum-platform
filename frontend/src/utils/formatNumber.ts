export interface NumberFormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface CurrencyFormatOptions extends NumberFormatOptions {
  currency?: string;
}

export const DEFAULT_LOCALE = "en-IN";

/**
 * Formats a regular number.
 */
export function formatNumber(
  value: number | null | undefined,
  options: NumberFormatOptions = {},
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  const {
    locale = DEFAULT_LOCALE,
    minimumFractionDigits,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats currency using ISO 4217 currency codes.
 * Examples: INR, USD, EUR.
 */
export function formatCurrency(
  value: number | null | undefined,
  options: CurrencyFormatOptions = {},
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  const {
    locale = DEFAULT_LOCALE,
    currency = "INR",
    minimumFractionDigits,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats a percentage.
 *
 * Pass 0.75 for 75%.
 */
export function formatPercentage(
  value: number | null | undefined,
  options: NumberFormatOptions = {},
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  const {
    locale = DEFAULT_LOCALE,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats large values in compact notation.
 * Example: 1200000 -> 12L in en-IN.
 */
export function formatCompactNumber(
  value: number | null | undefined,
  locale = DEFAULT_LOCALE,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats a number with grouping separators but no decimals.
 */
export function formatInteger(
  value: number | null | undefined,
  locale = DEFAULT_LOCALE,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
}
