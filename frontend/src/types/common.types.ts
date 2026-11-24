export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;
export type TimeZone = string;

export interface Address {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface ContactInformation {
  email?: string;
  phoneNumber?: string;
}

export interface AuditFields {
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
  createdBy?: UUID;
  updatedBy?: UUID;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface DateRange {
  fromDate: ISODate;
  toDate: ISODate;
}

export type SortDirection = "ASC" | "DESC";

export interface SortParams {
  field: string;
  direction: SortDirection;
}

export type EntityStatus =
  "ACTIVE" | "INACTIVE" | "PENDING" | "ARCHIVED" | (string & {});
