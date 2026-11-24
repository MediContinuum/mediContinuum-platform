import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera, ImagePlus, LoaderCircle, Upload, X } from "lucide-react";

import type { AIAnalysisResult } from "../types/ai.types";

import MedicineIdentification from "./MedicineIdentification";

interface MedicineScannerProps {
  loading?: boolean;
  result?: AIAnalysisResult | null;
  error?: string | null;
  onAnalyze: (file: File) => Promise<unknown>;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function MedicineScanner({
  loading = false,
  result,
  error,
  onAnalyze,
}: MedicineScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;

    setLocalError(null);

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setLocalError("Please select an image file.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setLocalError("Image size must not exceed 10 MB.");
      return;
    }

    setFile(selected);
  }

  async function handleAnalyze() {
    if (!file) {
      setLocalError("Select a medicine image first.");
      return;
    }

    try {
      setLocalError(null);
      await onAnalyze(file);
    } catch {
      // The hook exposes the API error to the parent page.
    }
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
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
            <Camera className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Scan medicine packaging
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload a clear photo of the medicine packaging or label.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Select medicine image"
        />

        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-6 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-5 py-12 text-center transition-colors hover:border-[#087E8B] hover:bg-[#E5F3F4]/40"
          >
            <ImagePlus className="size-10 text-[#087E8B]" />

            <span className="mt-4 font-semibold text-foreground">
              Upload medicine image
            </span>

            <span className="mt-1 text-sm text-muted-foreground">
              JPG, PNG, WEBP or another browser-supported image · Maximum 10 MB
            </span>
          </button>
        ) : (
          <div className="mt-6 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={clearFile}
                aria-label="Remove selected image"
                disabled={loading}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            {preview && (
              <img
                src={preview}
                alt="Selected medicine packaging"
                className="mt-4 max-h-72 w-full rounded-lg bg-muted object-contain"
              />
            )}
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
          onClick={handleAnalyze}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#12304A] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1b4564] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Analysing image...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Identify medicine
            </>
          )}
        </button>
      </section>

      <MedicineIdentification result={result} loading={loading} />
    </div>
  );
}

export default MedicineScanner;
