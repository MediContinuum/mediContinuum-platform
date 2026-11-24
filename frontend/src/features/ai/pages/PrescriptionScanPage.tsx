import { FileSearch, ShieldCheck } from "lucide-react";

import { useAI } from "../hooks/useAI";

import PrescriptionScanner from "../components/PrescriptionScanner";

function PrescriptionScanPage() {
  const { analyzeFile, fileResult, isAnalyzingFile, error, reset } = useAI();

  async function handleScan(file: File) {
    await analyzeFile("PRESCRIPTION_SCAN", file);
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Prescription scanning failed."
        : null;

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]">
          <FileSearch className="size-4" />
          AI document processing
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Prescription scanner
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Upload a prescription document to extract text and structured
          information for manual review.
        </p>
      </header>

      <PrescriptionScanner
        loading={isAnalyzingFile}
        result={fileResult?.task === "PRESCRIPTION_SCAN" ? fileResult : null}
        error={errorMessage}
        onScan={handleScan}
      />

      <section className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#087E8B]" />

        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Prescription data protection
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Prescription documents contain sensitive health information. Only
            submit documents through an authorised, secure backend. Extracted
            information must be verified before it is entered into a patient's
            record.
          </p>
        </div>
      </section>

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

export default PrescriptionScanPage;
