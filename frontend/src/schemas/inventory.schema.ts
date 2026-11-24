import { z } from "zod";

export const createInventoryBatchSchema = z.object({
  medicineId: z.uuid("Select a valid medicine"),
  batchNumber: z.string().trim().min(1, "Batch number is required"),
  expiryDate: z.iso.date("Enter a valid expiry date"),
  quantity: z.number().positive("Quantity must be greater than zero"),
  stockUnit: z.string().trim().min(1, "Stock unit is required"),
  lowStockThreshold: z.number().nonnegative("Threshold cannot be negative"),
  notes: z.string().trim().optional(),
});

export const consumeInventorySchema = z.object({
  quantity: z
    .number()
    .positive("Consumption quantity must be greater than zero"),
  notes: z.string().trim().optional(),
});

export const updateLowStockThresholdSchema = z.object({
  lowStockThreshold: z.number().nonnegative("Threshold cannot be negative"),
});

export type CreateInventoryBatchFormValues = z.infer<
  typeof createInventoryBatchSchema
>;
export type ConsumeInventoryFormValues = z.infer<typeof consumeInventorySchema>;
export type UpdateLowStockThresholdFormValues = z.infer<
  typeof updateLowStockThresholdSchema
>;
