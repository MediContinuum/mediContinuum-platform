import api from "@/lib/axios";
import type {
  AIRequest,
  AIResponse,
  AIChatRequest,
  AIChatResponse,
  AIRecommendationResponse,
} from "@/types/ai.types";

export const aiService = {
  generateResponse: async (data: AIRequest): Promise<AIResponse> => {
    const response = await api.post<AIResponse>("/ai/generate", data);
    return response.data;
  },

  chat: async (data: AIChatRequest): Promise<AIChatResponse> => {
    const response = await api.post<AIChatResponse>("/ai/chat", data);
    return response.data;
  },

  getRecommendations: async (
    params?: Record<string, string>,
  ): Promise<AIRecommendationResponse> => {
    const response = await api.get<AIRecommendationResponse>(
      "/ai/recommendations",
      { params },
    );
    return response.data;
  },
};
