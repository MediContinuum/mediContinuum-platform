import api from "@/lib/axios";
import type {
  AIRequest,
  AIResponse,
  AIChatRequest,
  AIChatResponse,
  AIRecommendationResponse,
} from "@/types/ai.types";
import type {
  AIAnalysisResult,
  AITask,
} from "@/features/ai/types/ai.types";

/**
 * Browser-to-server AI API adapter.
 *
 * This module only serializes requests and returns API responses. Model
 * inference, prompt execution, data access, and clinical or inventory rules
 * belong to the backend service; none of those operations run in the browser.
 */

const FEATURE_AI_ENDPOINTS: Record<AITask, string> = {
  ADHERENCE_INSIGHTS: "/ai/generate",
  INVENTORY_INSIGHTS: "/ai/generate",
  ANOMALY_DETECTION: "/ai/generate",
  MEDICINE_IDENTIFICATION: "/ai/medicine/identify",
  PRESCRIPTION_SCAN: "/ai/prescriptions/scan",
  TEXT_MEDICATION_UPDATE: "/ai/generate",
  VOICE_MEDICATION_UPDATE: "/ai/generate",
};

export interface FeatureAITextRequest {
  /** Task identifier interpreted by the backend's registered task handler. */
  task: AITask;
  /** Optional user-provided text; never a prompt or set of business instructions. */
  input?: string;
  context?: Record<string, unknown>;
}

export interface FeatureAIFileRequest {
  task: "MEDICINE_IDENTIFICATION" | "PRESCRIPTION_SCAN";
  file: File;
  additionalContext?: string;
}

/**
 * Normalize the response envelope for rendering. This does not perform
 * analysis or infer findings; all result content is returned by the API.
 */
function normalizeFeatureAIResponse(
  response: unknown,
  task: AITask,
): AIAnalysisResult {
  let result = response;

  for (let depth = 0; depth < 2; depth += 1) {
    if (
      result &&
      typeof result === "object" &&
      !Array.isArray(result) &&
      "data" in result
    ) {
      result = (result as { data: unknown }).data;
    } else {
      break;
    }
  }

  if (!result || typeof result !== "object") {
    return {
      task,
      result: String(result ?? ""),
      requiresHumanReview: true,
    };
  }

  return {
    ...(result as Partial<AIAnalysisResult>),
    task,
    // AI output is always presented as requiring human verification.
    requiresHumanReview: true,
  };
}

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

  /**
   * Send a task identifier and optional user input to the backend.
   * Task prompts, analysis policies, data access, and result generation must
   * live on the server; the browser must not author or execute those rules.
   */
  generateFeatureAnalysis: async (
    request: FeatureAITextRequest,
  ): Promise<AIAnalysisResult> => {
    const response = await api.post(
      FEATURE_AI_ENDPOINTS[request.task],
      {
        task: request.task,
        input: request.input,
        context: request.context ?? {},
      },
    );

    return normalizeFeatureAIResponse(response.data, request.task);
  },

  /**
   * Upload a user-selected file for server-side identification/extraction.
   * File selection and preview stay in the browser; file processing stays
   * behind the backend API.
   */
  analyzeFeatureFile: async (
    request: FeatureAIFileRequest,
  ): Promise<AIAnalysisResult> => {
    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("task", request.task);

    if (request.additionalContext) {
      formData.append("context", request.additionalContext);
    }

    const response = await api.post(
      FEATURE_AI_ENDPOINTS[request.task],
      formData,
    );

    return normalizeFeatureAIResponse(response.data, request.task);
  },
};
