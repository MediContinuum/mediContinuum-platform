import api from "@/lib/axios";
import type {
  FamilyConnection,
  FamilyConnectionId,
  FamilyMember,
  CreateFamilyConnectionRequest,
} from "@/types/family.types";

export const familyService = {
  sendRequest: async (
    data: CreateFamilyConnectionRequest,
  ): Promise<FamilyConnection> => {
    const response = await api.post<FamilyConnection>(
      "/family/connections",
      data,
    );
    return response.data;
  },

  getConnections: async (): Promise<FamilyMember[]> => {
    const response = await api.get<FamilyMember[]>("/family/connections");
    return response.data;
  },

  getReceivedRequests: async (): Promise<FamilyConnection[]> => {
    const response = await api.get<FamilyConnection[]>(
      "/family/connections/requests/received",
    );
    return response.data;
  },

  getSentRequests: async (): Promise<FamilyConnection[]> => {
    const response = await api.get<FamilyConnection[]>(
      "/family/connections/requests/sent",
    );
    return response.data;
  },

  acceptRequest: async (id: FamilyConnectionId): Promise<void> => {
    await api.patch(`/family/connections/${id}/accept`);
  },

  rejectRequest: async (id: FamilyConnectionId): Promise<void> => {
    await api.patch(`/family/connections/${id}/reject`);
  },

  cancelRequest: async (id: FamilyConnectionId): Promise<void> => {
    await api.patch(`/family/connections/${id}/cancel`);
  },

  removeConnection: async (id: FamilyConnectionId): Promise<void> => {
    await api.delete(`/family/connections/${id}`);
  },
};
