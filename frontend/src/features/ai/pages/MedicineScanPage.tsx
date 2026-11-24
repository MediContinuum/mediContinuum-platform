import { useAI } from "../hooks/useAI";

import MedicineScanner from "../components/MedicineScanner";

function MedicineScanPage() {
  const { analyzeFile, fileResult, isAnalyzingFile, error, reset } = useAI();

  async function handleAnalyze(file: File) {
    await analyzeFile("MEDICINE_IDENTIFICATION", file);
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Medicine identification failed."
        : null;

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-medium text-[#087E8B]">AI medicine tools</p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Medicine scanner
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Submit a clear image of medicine packaging for assistive text
          extraction and medicine identification.
        </p>
      </header>

      <MedicineScanner
        loading={isAnalyzingFile}
        result={
          fileResult?.task === "MEDICINE_IDENTIFICATION" ? fileResult : null
        }
        error={errorMessage}
        onAnalyze={handleAnalyze}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Clear scan result
        </button>
      </div>
    </main>
  );
}

export default MedicineScanPage;
