export type AITask =
  | "ADHERENCE_INSIGHTS"
  | "INVENTORY_INSIGHTS"
  | "ANOMALY_DETECTION"
  | "MEDICINE_IDENTIFICATION"
  | "PRESCRIPTION_SCAN"
  | "TEXT_MEDICATION_UPDATE"
  | "VOICE_MEDICATION_UPDATE";

export interface AIInsight {
  id?: string;
  title: string;
  summary: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category?: string;
  details?: string;
  recommendations?: string[];
  confidence?: number;
  createdAt?: string;
}

export interface AIAnalysisResult {
  id?: string;
  task: AITask;
  title?: string;
  summary?: string;
  result?: string;
  findings?: AIInsight[];
  recommendations?: string[];
  extractedText?: string;
  extractedData?: Record<string, unknown>;
  confidence?: number;
  createdAt?: string;
  requiresHumanReview: boolean;
  disclaimer?: string;
}

export interface AIAnalysisRequest {
  task: AITask;
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AIAnomaly {
  id: string;
  title: string;
  description: string;
  /** Severity is optional because only the server may classify a finding. */
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category?: string;
  /** Timestamp supplied by the API; the browser must not invent detection time. */
  detectedAt?: string;
  recommendation?: string;
}

export interface AIFileAnalysis {
  file: File;
  previewUrl?: string;
  status: "idle" | "uploading" | "success" | "error";
  result?: AIAnalysisResult;
  error?: string;
}

export interface AITextMedicationUpdate {
  text: string;
  patientId?: string;
}

export interface AIVoiceMedicationUpdate {
  transcript: string;
  patientId?: string;
}

export interface AIMedicineIdentification {
  medicineName?: string;
  genericName?: string;
  strength?: string;
  dosageForm?: string;
  confidence?: number;
  extractedText?: string;
}

export interface AIPrescriptionExtraction {
  patientName?: string;
  doctorName?: string;
  prescriptionDate?: string;
  medicines?: Array<{
    medicineName?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  extractedText?: string;
}

export const AI_MEDICAL_DISCLAIMER =
  "AI-generated information may be incomplete or inaccurate. Verify all results with an authorised healthcare professional before making clinical decisions.";
