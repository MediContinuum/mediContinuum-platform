import api from "@/lib/axios";

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  ipAddress?: string;
  createdAt?: string;
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  entityType?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export const auditService = {
  getAll: async (params?: AuditLogFilters): Promise<AuditLog[]> => {
    const response = await api.get<AuditLog[]>("/audit", { params });
    return response.data;
  },

  getById: async (id: string): Promise<AuditLog> => {
    const response = await api.get<AuditLog>(`/audit/${id}`);
    return response.data;
  },

  getByUser: async (userId: string): Promise<AuditLog[]> => {
    const response = await api.get<AuditLog[]>(`/audit/users/${userId}`);
    return response.data;
  },
};
