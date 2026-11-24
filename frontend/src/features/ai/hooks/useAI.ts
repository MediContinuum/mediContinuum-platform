import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

import type {
  AIAnalysisRequest,
  AIAnalysisResult,
  AITask,
} from "../types/ai.types";

export const AI_QUERY_KEYS = {
  all: ["ai"] as const,
  insights: ["ai", "insights"] as const,
  adherence: ["ai", "adherence-insights"] as const,
  inventory: ["ai", "inventory-insights"] as const,
  anomalies: ["ai", "anomalies"] as const,
};

export const AI_ENDPOINTS: Record<AITask, string> = {
  ADHERENCE_INSIGHTS: "/ai/generate",
  INVENTORY_INSIGHTS: "/ai/generate",
  ANOMALY_DETECTION: "/ai/generate",
  MEDICINE_IDENTIFICATION: "/ai/medicine/identify",
  PRESCRIPTION_SCAN: "/ai/prescriptions/scan",
  TEXT_MEDICATION_UPDATE: "/ai/generate",
  VOICE_MEDICATION_UPDATE: "/ai/generate",
};

interface TextAnalysisVariables {
  task: AITask;
  prompt: string;
  context?: Record<string, unknown>;
}

interface FileAnalysisVariables {
  task: "MEDICINE_IDENTIFICATION" | "PRESCRIPTION_SCAN";
  file: File;
  additionalContext?: string;
}

function normalizeAIResponse(
  response: unknown,
  task: AITask,
): AIAnalysisResult {
  let result = response;

  if (result && typeof result === "object" && "data" in result) {
    result = (result as { data: unknown }).data;
  }

  if (result && typeof result === "object" && "data" in result) {
    result = (result as { data: unknown }).data;
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
    requiresHumanReview: true,
  };
}

export function useAI() {
  const queryClient = useQueryClient();

  const textAnalysisMutation = useMutation({
    mutationFn: async (request: TextAnalysisVariables) => {
      const response = await api.post(AI_ENDPOINTS[request.task], {
        task: request.task,
        prompt: request.prompt,
        context: request.context ?? {},
      });

      return normalizeAIResponse(response.data, request.task);
    },

    onSuccess: (result) => {
      queryClient.setQueryData(
        [...AI_QUERY_KEYS.insights, result.task],
        result,
      );
    },
  });

  const fileAnalysisMutation = useMutation({
    mutationFn: async ({
      task,
      file,
      additionalContext,
    }: FileAnalysisVariables) => {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("task", task);

      if (additionalContext) {
        formData.append("context", additionalContext);
      }

      const response = await api.post(AI_ENDPOINTS[task], formData);

      return normalizeAIResponse(response.data, task);
    },

    onSuccess: (result) => {
      queryClient.setQueryData(
        [...AI_QUERY_KEYS.insights, result.task],
        result,
      );
    },
  });

  const runTextAnalysis = (
    task: AITask,
    prompt: string,
    context?: Record<string, unknown>,
  ) => {
    return textAnalysisMutation.mutateAsync({
      task,
      prompt,
      context,
    });
  };

  const analyzeFile = (
    task: "MEDICINE_IDENTIFICATION" | "PRESCRIPTION_SCAN",
    file: File,
    additionalContext?: string,
  ) => {
    return fileAnalysisMutation.mutateAsync({
      task,
      file,
      additionalContext,
    });
  };

  const reset = () => {
    textAnalysisMutation.reset();
    fileAnalysisMutation.reset();
  };

  return {
    runTextAnalysis,
    analyzeFile,

    textResult: textAnalysisMutation.data,
    fileResult: fileAnalysisMutation.data,

    isAnalyzingText: textAnalysisMutation.isPending,
    isAnalyzingFile: fileAnalysisMutation.isPending,

    isError: textAnalysisMutation.isError || fileAnalysisMutation.isError,

    error: textAnalysisMutation.error ?? fileAnalysisMutation.error ?? null,

    reset,
  };
}
