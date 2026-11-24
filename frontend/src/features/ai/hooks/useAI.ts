import { useMutation, useQueryClient } from "@tanstack/react-query";

import { aiService } from "@/services/ai.service";

import type {
  AIAnalysisResult,
  AITask,
} from "../types/ai.types";
import type {
  FeatureAIFileRequest,
  FeatureAITextRequest,
} from "@/services/ai.service";

/**
 * Browser-only React Query state for AI screens.
 *
 * This hook manages loading/error/result state and cache updates. It does not
 * call backend endpoints directly or run AI/business logic; HTTP transport is
 * centralized in src/services/ai.service.ts, and analysis is server-owned.
 */

export const AI_QUERY_KEYS = {
  all: ["ai"] as const,
  insights: ["ai", "insights"] as const,
  adherence: ["ai", "adherence-insights"] as const,
  inventory: ["ai", "inventory-insights"] as const,
  anomalies: ["ai", "anomalies"] as const,
};

export type TextAnalysisVariables = FeatureAITextRequest;
export type FileAnalysisVariables = FeatureAIFileRequest;

export function useAI() {
  const queryClient = useQueryClient();

  const textAnalysisMutation = useMutation<
    AIAnalysisResult,
    Error,
    TextAnalysisVariables
  >({
    mutationFn: (request) => aiService.generateFeatureAnalysis(request),
    onSuccess: (result) => {
      queryClient.setQueryData(
        [...AI_QUERY_KEYS.insights, result.task],
        result,
      );
    },
  });

  const fileAnalysisMutation = useMutation<
    AIAnalysisResult,
    Error,
    FileAnalysisVariables
  >({
    mutationFn: (request) => aiService.analyzeFeatureFile(request),
    onSuccess: (result) => {
      queryClient.setQueryData(
        [...AI_QUERY_KEYS.insights, result.task],
        result,
      );
    },
  });

  /**
   * Submit a task and optional user content. Analysis instructions and
   * business rules are resolved by the backend task handler.
   */
  const runTextAnalysis = (
    task: AITask,
    input?: string,
    context?: Record<string, unknown>,
  ) => {
    return textAnalysisMutation.mutateAsync({
      task,
      input,
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
