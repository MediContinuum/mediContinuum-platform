import { CheckCircle2, Pill, Search, ShieldAlert } from "lucide-react";

import type { AIAnalysisResult } from "../types/ai.types";

interface MedicineIdentificationProps {
  result?: AIAnalysisResult | null;
  loading?: boolean;
  onIdentify?: () => void;
}

function MedicineIdentification({
  result,
  loading = false,
  onIdentify,
}: MedicineIdentificationProps) {
  const extracted = result?.extractedData ?? {};

  const medicineName =
    typeof extracted.medicineName === "string"
      ? extracted.medicineName
      : undefined;

  const genericName =
    typeof extracted.genericName === "string"
      ? extracted.genericName
      : undefined;

  const strength =
    typeof extracted.strength === "string" ? extracted.strength : undefined;

  const dosageForm =
    typeof extracted.dosageForm === "string" ? extracted.dosageForm : undefined;

  const fields = [
    { label: "Medicine name", value: medicineName },
    { label: "Generic name", value: genericName },
    { label: "Strength", value: strength },
    { label: "Dosage form", value: dosageForm },
  ].filter((item) => Boolean(item.value));

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
          <Pill className="size-5" />
        </div>

        <div>
          <h2 className="font-semibold text-foreground">
            Medicine identification
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Review details extracted from the submitted image.
          </p>
        </div>
      </div>

      {!result ? (
        <div className="py-8 text-center">
          <Search className="mx-auto size-8 text-muted-foreground" />

          <p className="mt-3 text-sm text-muted-foreground">
            No identification result yet.
          </p>

          {onIdentify && (
            <button
              type="button"
              onClick={onIdentify}
              disabled={loading}
              className="mt-4 rounded-lg bg-[#12304A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Identifying..." : "Identify medicine"}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {fields.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-muted/30 p-4"
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>

                  <p className="mt-1 font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              {result.summary ??
                result.result ??
                "No structured medicine details were returned."}
            </p>
          )}

          {result.confidence !== undefined && (
            <p className="text-sm text-muted-foreground">
              Model confidence: {result.confidence}%
            </p>
          )}

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-700" />

              <p className="text-sm leading-6 text-amber-900">
                Image-based identification is not definitive. Verify the
                packaging, active ingredient, strength and expiry with a
                pharmacist or qualified healthcare professional.
              </p>
            </div>
          </div>

          {result.requiresHumanReview && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="size-4 text-[#087E8B]" />
              Human verification required.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default MedicineIdentification;
