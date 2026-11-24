export type VendorId = string;

export interface Vendor {
  id: VendorId;
  name: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  contactPerson?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorRequest {
  name: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  contactPerson?: string;
}

export interface UpdateVendorRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  contactPerson?: string;
  status?: string;
}
