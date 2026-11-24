import api from "@/lib/axios";
import type {
  Organisation,
  OrganisationId,
  OrganisationMember,
  CreateOrganisationRequest,
  UpdateOrganisationRequest,
  AddOrganisationMemberRequest,
} from "@/types/organisation.types";

export const organisationService = {
  create: async (data: CreateOrganisationRequest): Promise<Organisation> => {
    const response = await api.post<Organisation>("/organisations", data);
    return response.data;
  },

  getAll: async (): Promise<Organisation[]> => {
    const response = await api.get<Organisation[]>("/organisations");
    return response.data;
  },

  getById: async (id: OrganisationId): Promise<Organisation> => {
    const response = await api.get<Organisation>(`/organisations/${id}`);
    return response.data;
  },

  update: async (
    id: OrganisationId,
    data: UpdateOrganisationRequest,
  ): Promise<Organisation> => {
    const response = await api.put<Organisation>(`/organisations/${id}`, data);
    return response.data;
  },

  getMembers: async (id: OrganisationId): Promise<OrganisationMember[]> => {
    const response = await api.get<OrganisationMember[]>(
      `/organisations/${id}/members`,
    );
    return response.data;
  },

  addMember: async (
    id: OrganisationId,
    data: AddOrganisationMemberRequest,
  ): Promise<OrganisationMember> => {
    const response = await api.post<OrganisationMember>(
      `/organisations/${id}/members`,
      data,
    );
    return response.data;
  },

  removeMember: async (id: OrganisationId, memberId: string): Promise<void> => {
    await api.delete(`/organisations/${id}/members/${memberId}`);
  },
};
