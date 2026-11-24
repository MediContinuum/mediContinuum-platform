import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adherenceService } from "@/services/adherence.service";

import type {
  GenerateScheduleRequest,
  UpdateDoseStatusRequest,
} from "@/types/adherence.types";

import type {
  AdherenceSummaryView,
  MedicationDose,
  AdherenceStatus,
} from "../types/adherence.types";

/* -------------------------------------------------------------------------- */
/* QUERY KEYS                                                                  */
/* -------------------------------------------------------------------------- */

export const ADHERENCE_QUERY_KEYS = {
  all: ["adherence"] as const,

  schedules: (patientId?: string) =>
    ["adherence", "schedules", patientId ?? "me"] as const,

  summary: ["adherence", "summary", "me"] as const,
};

/* -------------------------------------------------------------------------- */
/* RESPONSE NORMALIZATION                                                      */
/* -------------------------------------------------------------------------- */

function unwrapResponse(value: unknown): unknown {
  let result = value;

  for (let index = 0; index < 3; index += 1) {
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

  return result;
}

function normalizeSchedules(response: unknown): MedicationDose[] {
  const result = unwrapResponse(response);

  if (Array.isArray(result)) {
    return result as MedicationDose[];
  }

  if (result && typeof result === "object") {
    const data = result as Record<string, unknown>;

    const collection =
      data.schedules ??
      data.doses ??
      data.items ??
      data.content ??
      data.results;

    if (Array.isArray(collection)) {
      return collection as MedicationDose[];
    }
  }

  return [];
}

function normalizeSummary(response: unknown): AdherenceSummaryView | null {
  const result = unwrapResponse(response);

  if (!result || typeof result !== "object") {
    return null;
  }

  return result as AdherenceSummaryView;
}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                        */
/* -------------------------------------------------------------------------- */

interface UseAdherenceOptions {
  patientId?: string;
  enabled?: boolean;
}

interface UpdateDoseVariables {
  doseScheduleId: string;
  status: "TAKEN" | "SKIPPED";
}

export function useAdherence(options: UseAdherenceOptions = {}) {
  const queryClient = useQueryClient();

  const { patientId, enabled = true } = options;

  /* ---------------------------------------------------------------------- */
  /* SCHEDULES QUERY                                                        */
  /* ---------------------------------------------------------------------- */

  const schedulesQuery = useQuery({
    queryKey: ADHERENCE_QUERY_KEYS.schedules(patientId),

    queryFn: async () => {
      const response = patientId
        ? await adherenceService.getPatientSchedules(patientId)
        : await adherenceService.getMySchedules();

      return normalizeSchedules(response);
    },

    enabled,
    staleTime: 60 * 1000,
  });

  /* ---------------------------------------------------------------------- */
  /* SUMMARY QUERY                                                          */
  /* ---------------------------------------------------------------------- */

  const summaryQuery = useQuery({
    queryKey: ADHERENCE_QUERY_KEYS.summary,

    queryFn: async () => {
      const response = await adherenceService.getMySummary();

      return normalizeSummary(response);
    },

    enabled: enabled && !patientId,
    staleTime: 60 * 1000,
  });

  /* ---------------------------------------------------------------------- */
  /* UPDATE DOSE STATUS                                                     */
  /* ---------------------------------------------------------------------- */

  const updateDoseMutation = useMutation({
    mutationFn: async ({ doseScheduleId, status }: UpdateDoseVariables) => {
      const request = {
        status,
      } as unknown as UpdateDoseStatusRequest;

      return adherenceService.updateDoseStatus(doseScheduleId, request);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ADHERENCE_QUERY_KEYS.all,
      });
    },
  });

  /* ---------------------------------------------------------------------- */
  /* GENERATE SCHEDULES                                                     */
  /* ---------------------------------------------------------------------- */

  const generateSchedulesMutation = useMutation({
    mutationFn: (request: GenerateScheduleRequest) =>
      adherenceService.generateSchedules(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ADHERENCE_QUERY_KEYS.all,
      });
    },
  });

  /* ---------------------------------------------------------------------- */
  /* RETURN                                                                  */
  /* ---------------------------------------------------------------------- */

  const schedules = schedulesQuery.data ?? [];

  const markDoseTaken = (doseScheduleId: string) => {
    if (!doseScheduleId) return;

    updateDoseMutation.mutate({
      doseScheduleId,
      status: "TAKEN",
    });
  };

  const skipDose = (doseScheduleId: string) => {
    if (!doseScheduleId) return;

    updateDoseMutation.mutate({
      doseScheduleId,
      status: "SKIPPED",
    });
  };

  const updateDoseStatus = (
    doseScheduleId: string,
    status: "TAKEN" | "SKIPPED",
  ) => {
    if (!doseScheduleId) return;

    updateDoseMutation.mutate({
      doseScheduleId,
      status,
    });
  };

  return {
    schedules,

    summary: summaryQuery.data ?? null,

    isLoading: schedulesQuery.isPending || summaryQuery.isPending,

    isSchedulesLoading: schedulesQuery.isPending,
    isSummaryLoading: summaryQuery.isPending,

    isError: schedulesQuery.isError || summaryQuery.isError,

    error: schedulesQuery.error ?? summaryQuery.error ?? null,

    isUpdating: updateDoseMutation.isPending,
    isGenerating: generateSchedulesMutation.isPending,

    updateError: updateDoseMutation.error,
    generateError: generateSchedulesMutation.error,

    markDoseTaken,
    skipDose,
    updateDoseStatus,

    generateSchedules: generateSchedulesMutation.mutateAsync,

    refetch: schedulesQuery.refetch,
    refetchSummary: summaryQuery.refetch,
  };
}
