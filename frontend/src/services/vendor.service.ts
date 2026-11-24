import api from "@/lib/axios";
import type {
  Vendor,
  VendorId,
  CreateVendorRequest,
  UpdateVendorRequest,
} from "@/types/vendor.types";

export const vendorService = {
  create: async (data: CreateVendorRequest): Promise<Vendor> => {
    const response = await api.post<Vendor>("/vendors", data);
    return response.data;
  },

  getAll: async (): Promise<Vendor[]> => {
    const response = await api.get<Vendor[]>("/vendors");
    return response.data;
  },

  getById: async (id: VendorId): Promise<Vendor> => {
    const response = await api.get<Vendor>(`/vendors/${id}`);
    return response.data;
  },

  update: async (id: VendorId, data: UpdateVendorRequest): Promise<Vendor> => {
    const response = await api.put<Vendor>(`/vendors/${id}`, data);
    return response.data;
  },

  delete: async (id: VendorId): Promise<void> => {
    await api.delete(`/vendors/${id}`);
  },
};
