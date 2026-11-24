import api from "@/lib/axios";
import type {
  User,
  UserId,
  GlobalUserId,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user.types";

export const userService = {
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>("/users", data);
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: UserId): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  getByGlobalId: async (globalUserId: GlobalUserId): Promise<User> => {
    const response = await api.get<User>(`/users/global-id/${globalUserId}`);
    return response.data;
  },

  update: async (id: UserId, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  deactivate: async (id: UserId): Promise<void> => {
    await api.patch(`/users/${id}/deactivate`);
  },
};
