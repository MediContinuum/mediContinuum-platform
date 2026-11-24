import { useRef, useState, type ChangeEvent } from "react";
import { FileImage, FileText, LoaderCircle, Upload, X } from "lucide-react";

import type { AIAnalysisResult } from "../types/ai.types";

interface PrescriptionScannerProps {
  loading?: boolean;
  result?: AIAnalysisResult | null;
  error?: string | null;
  onScan: (file: File) => Promise<unknown>;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024;

function PrescriptionScanner({
  loading = false,
  result,
  error,
  onScan,
}: PrescriptionScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;

    setLocalError(null);

    if (!selected) return;

    const validType =
      selected.type === "application/pdf" || selected.type.startsWith("image/");

    if (!validType) {
      setLocalError("Upload a PDF or supported image file.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setLocalError("File size must not exceed 15 MB.");
      return;
    }

    setFile(selected);
  }

  async function handleScan() {
    if (!file) {
      setLocalError("Select a prescription before scanning.");
      return;
    }

    try {
      setLocalError(null);
      await onScan(file);
    } catch {
      // The parent page displays the mutation error.
    }
  }

  function clearFile() {
    setFile(null);
    setLocalError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
            <FileText className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Prescription document scanner
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload a prescription image or PDF for text extraction.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Select prescription document"
        />

        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-6 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-5 py-12 text-center transition-colors hover:border-[#087E8B] hover:bg-[#E5F3F4]/40"
          >
            <FileImage className="size-10 text-[#087E8B]" />

            <span className="mt-4 font-semibold text-foreground">
              Select prescription document
            </span>

            <span className="mt-1 text-sm text-muted-foreground">
              PDF, JPG, PNG or WEBP · Maximum 15 MB
            </span>
          </button>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
              <FileText className="size-5 text-[#087E8B]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              aria-label="Remove selected document"
              disabled={loading}
              onClick={clearFile}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {(localError || error) && (
          <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
            {localError ?? error}
          </p>
        )}

        <button
          type="button"
          disabled={!file || loading}
          onClick={handleScan}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#12304A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1b4564] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Processing document...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Scan prescription
            </>
          )}
        </button>
      </section>

      {result && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground">Extraction result</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {result.summary ??
              result.result ??
              "Document processing completed."}
          </p>

          {result.extractedText && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-foreground">
                Extracted text
              </h3>

              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-xs leading-6 text-muted-foreground">
                {result.extractedText}
              </pre>
            </div>
          )}

          {result.extractedData && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-foreground">
                Structured information
              </h3>

              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-xs leading-6 text-muted-foreground">
                {JSON.stringify(result.extractedData, null, 2)}
              </pre>
            </div>
          )}

          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            Verify the patient, medicine, strength, dosage, frequency and
            duration against the original prescription. Scanned information must
            not automatically create or modify a prescription.
          </p>
        </section>
      )}
    </div>
  );
}

export default PrescriptionScanner;
