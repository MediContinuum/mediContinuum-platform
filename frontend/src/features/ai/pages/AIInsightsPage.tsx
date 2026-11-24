import { useMemo } from "react";
import { BrainCircuit, Sparkles } from "lucide-react";

import { useAI } from "../hooks/useAI";

import type { AIAnomaly } from "../types/ai.types";

import AIAdherenceInsights from "../components/AIAdherenceInsights";
import AnomalyDetectionPanel from "../components/AnomalyDetectionPanel";
import TextMedicationUpdate from "../components/TextMedicationUpdate";
import VoiceMedicationUpdate from "../components/VoiceMedicationUpdate";

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  return error instanceof Error
    ? error.message
    : "AI analysis could not be completed.";
}

/** Renders backend-generated insights; this page does not run analysis rules. */
function AIInsightsPage() {
  const { runTextAnalysis, textResult, isAnalyzingText, error, reset } =
    useAI();

  const adherenceResult =
    textResult?.task === "ADHERENCE_INSIGHTS" ? textResult : null;

  const anomalyResult =
    textResult?.task === "ANOMALY_DETECTION" ? textResult : null;

  const anomalies: AIAnomaly[] = useMemo(
    () =>
      (anomalyResult?.findings ?? []).map((finding, index) => ({
        id: finding.id ?? String(index),
        title: finding.title,
        description: finding.summary,
        severity: finding.severity,
        category: finding.category,
        detectedAt: finding.createdAt,
        recommendation: finding.recommendations?.join("; "),
      })),
    [anomalyResult],
  );

  async function generateAdherenceInsights() {
    // The server resolves the task's analysis policy and accesses authorised data.
    await runTextAnalysis("ADHERENCE_INSIGHTS");
  }

  async function runAnomalyDetection() {
    // Anomaly-detection rules and evidence checks are backend responsibilities.
    await runTextAnalysis("ANOMALY_DETECTION");
  }

  async function analyseMedicationText(text: string) {
    // Only user-entered content is sent; the backend owns prompt and validation rules.
    await runTextAnalysis("TEXT_MEDICATION_UPDATE", text);
  }

  async function analyseVoiceTranscript(transcript: string) {
    // The transcription is user input, not an instruction for the model.
    await runTextAnalysis("VOICE_MEDICATION_UPDATE", transcript);
  }

  const currentError = getErrorMessage(error);

  return (
    <main className="space-y-6">
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]">
          <BrainCircuit className="size-4" />
          Artificial intelligence
        </div>

        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              AI healthcare insights
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review AI-generated summaries of available medication information
              and submit draft updates for human verification.
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Sparkles className="size-4" />
            Clear results
          </button>
        </div>
      </header>

      <AIAdherenceInsights
        result={adherenceResult}
        loading={isAnalyzingText}
        error={currentError}
        onGenerate={generateAdherenceInsights}
      />

      <AnomalyDetectionPanel
        anomalies={anomalies}
        loading={isAnalyzingText}
        error={currentError}
        onRunDetection={runAnomalyDetection}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <TextMedicationUpdate
          loading={isAnalyzingText}
          onSubmit={analyseMedicationText}
        />

        <VoiceMedicationUpdate
          loading={isAnalyzingText}
          onSubmit={analyseVoiceTranscript}
        />
      </div>
    </main>
  );
}

export default AIInsightsPage;
