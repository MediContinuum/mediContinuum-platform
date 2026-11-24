import api from "@/lib/axios";
import type {
  InventoryItem,
  InventoryBatch,
  InventorySummary,
  InventoryTransaction,
  InventoryItemId,
  CreateInventoryBatchRequest,
  ConsumeInventoryRequest,
  UpdateLowStockThresholdRequest,
} from "@/types/inventory.types";

export const inventoryService = {
  addBatch: async (
    data: CreateInventoryBatchRequest,
  ): Promise<InventoryBatch> => {
    const response = await api.post<InventoryBatch>(
      "/inventory/me/batches",
      data,
    );
    return response.data;
  },

  getMyInventory: async (): Promise<InventoryItem[]> => {
    const response = await api.get<InventoryItem[]>("/inventory/me");
    return response.data;
  },

  getMySummary: async (): Promise<InventorySummary> => {
    const response = await api.get<InventorySummary>("/inventory/me/summary");
    return response.data;
  },

  getLowStock: async (): Promise<InventoryItem[]> => {
    const response = await api.get<InventoryItem[]>("/inventory/me/low-stock");
    return response.data;
  },

  getExpiring: async (withinDays = 30): Promise<InventoryItem[]> => {
    const response = await api.get<InventoryItem[]>("/inventory/me/expiring", {
      params: { withinDays },
    });
    return response.data;
  },

  getItemById: async (id: InventoryItemId): Promise<InventoryItem> => {
    const response = await api.get<InventoryItem>(`/inventory/me/items/${id}`);
    return response.data;
  },

  consume: async (
    id: InventoryItemId,
    data: ConsumeInventoryRequest,
  ): Promise<void> => {
    await api.post(`/inventory/me/items/${id}/consume`, data);
  },

  updateThreshold: async (
    id: InventoryItemId,
    data: UpdateLowStockThresholdRequest,
  ): Promise<InventoryItem> => {
    const response = await api.patch<InventoryItem>(
      `/inventory/me/items/${id}/threshold`,
      data,
    );
    return response.data;
  },

  getTransactions: async (
    id: InventoryItemId,
  ): Promise<InventoryTransaction[]> => {
    const response = await api.get<InventoryTransaction[]>(
      `/inventory/me/items/${id}/transactions`,
    );
    return response.data;
  },

  getPatientInventory: async (patientId: string): Promise<InventoryItem[]> => {
    const response = await api.get<InventoryItem[]>(
      `/inventory/patients/${patientId}`,
    );
    return response.data;
  },
};
