import { BrainCircuit, RefreshCw, Warehouse } from "lucide-react";

import { useAI } from "../hooks/useAI";

import AIInventoryInsights from "../components/AIInventoryInsights";
import AnomalyDetectionPanel from "../components/AnomalyDetectionPanel";

function InventoryIntelligencePage() {
  const { runTextAnalysis, textResult, isAnalyzingText, error, reset } =
    useAI();

  const inventoryResult =
    textResult?.task === "INVENTORY_INSIGHTS" ? textResult : null;

  const anomalyResult =
    textResult?.task === "ANOMALY_DETECTION" ? textResult : null;

  const anomalies = (anomalyResult?.findings ?? []).map((finding, index) => ({
    id: finding.id ?? String(index),
    title: finding.title,
    description: finding.summary,
    severity: finding.severity ?? ("MEDIUM" as const),
    category: finding.category,
    recommendation: finding.recommendations?.join("; "),
    detectedAt: new Date().toISOString(),
  }));

  async function analyseInventory() {
    await runTextAnalysis(
      "INVENTORY_INSIGHTS",
      "Analyse the authorised inventory records available to this user. Highlight stock levels, expiry-related observations and unusual patterns only where supported by supplied data. Do not invent quantities or recommend clinical substitutions.",
    );
  }

  async function detectInventoryAnomalies() {
    await runTextAnalysis(
      "ANOMALY_DETECTION",
      "Review authorised medicine inventory activity for unusual stock or transaction patterns. Return observations supported by data and indicate where human review is necessary.",
    );
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Unable to complete AI analysis."
        : null;

  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]">
            <BrainCircuit className="size-4" />
            AI-powered inventory
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            Inventory intelligence
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review stock-related insights and unusual inventory activity using
            available authorised records.
          </p>
        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          <RefreshCw className="size-4" />
          Clear results
        </button>
      </header>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
            <Warehouse className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Inventory analysis
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Generate a review of available medicine inventory records.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={analyseInventory}
          disabled={isAnalyzingText}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#12304A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1b4564] disabled:opacity-50"
        >
          <BrainCircuit className="size-4" />
          {isAnalyzingText
            ? "Analysing inventory..."
            : "Generate inventory insights"}
        </button>
      </section>

      <AIInventoryInsights
        result={inventoryResult}
        loading={isAnalyzingText}
        error={errorMessage}
        onGenerate={analyseInventory}
      />

      <AnomalyDetectionPanel
        anomalies={anomalies}
        loading={isAnalyzingText}
        error={errorMessage}
        onRunDetection={detectInventoryAnomalies}
      />

      <p className="rounded-lg border border-border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground">
        Inventory insights are informational. Validate stock levels, batch
        details and expiry dates against the authoritative inventory system
        before taking action. AI output must not automatically modify stock.
      </p>
    </main>
  );
}

export default InventoryIntelligencePage;
