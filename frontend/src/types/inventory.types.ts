export type InventoryItemId = string;
export type InventoryBatchId = string;

export interface CreateInventoryBatchRequest {
  medicineId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  stockUnit: string;
  lowStockThreshold: number;
  notes?: string;
}

export interface InventoryBatch {
  id: InventoryBatchId;
  medicineId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  stockUnit: string;
  lowStockThreshold: number;
  notes?: string;
}

export interface InventoryItem {
  id: InventoryItemId;
  medicineId: string;
  medicineName?: string;
  totalQuantity?: number;
  stockUnit?: string;
  lowStockThreshold?: number;
  batches?: InventoryBatch[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InventorySummary {
  totalItems?: number;
  totalQuantity?: number;
  lowStockItems?: number;
  expiringItems?: number;
}

export interface ConsumeInventoryRequest {
  quantity: number;
  notes?: string;
}

export interface UpdateLowStockThresholdRequest {
  lowStockThreshold: number;
}

export interface InventoryTransaction {
  id: string;
  inventoryItemId?: string;
  medicineId?: string;
  transactionType?: string;
  quantity?: number;
  stockUnit?: string;
  notes?: string;
  createdAt?: string;
}

export interface ExpiringInventoryItem extends InventoryItem {
  expiryDate?: string;
  daysUntilExpiry?: number;
}
