export type PurchaseOrderId = string;

export type PurchaseOrderStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED"
  | (string & {});

export interface PurchaseOrderItemRequest {
  medicineId: string;
  quantity: number;
  unitPrice?: number;
  stockUnit?: string;
}

export interface CreatePurchaseOrderRequest {
  vendorId: string;
  items: PurchaseOrderItemRequest[];
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  medicineId: string;
  quantity: number;
  unitPrice?: number;
  stockUnit?: string;
}

export interface PurchaseOrder {
  id: PurchaseOrderId;
  vendorId: string;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  totalAmount?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePurchaseOrderStatusRequest {
  status: PurchaseOrderStatus;
}
