import api from "@/lib/axios";
import type {
  PurchaseOrder,
  PurchaseOrderId,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderStatusRequest,
} from "@/types/procurement.types";

export const procurementService = {
  create: async (data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> => {
    const response = await api.post<PurchaseOrder>("/procurement/orders", data);
    return response.data;
  },

  getAll: async (): Promise<PurchaseOrder[]> => {
    const response = await api.get<PurchaseOrder[]>("/procurement/orders");
    return response.data;
  },

  getById: async (id: PurchaseOrderId): Promise<PurchaseOrder> => {
    const response = await api.get<PurchaseOrder>(`/procurement/orders/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: PurchaseOrderId,
    data: UpdatePurchaseOrderStatusRequest,
  ): Promise<PurchaseOrder> => {
    const response = await api.patch<PurchaseOrder>(
      `/procurement/orders/${id}/status`,
      data,
    );
    return response.data;
  },

  cancel: async (id: PurchaseOrderId): Promise<void> => {
    await api.patch(`/procurement/orders/${id}/cancel`);
  },
};
