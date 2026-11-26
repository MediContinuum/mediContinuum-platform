// The Gemini API key is held exclusively by the Spring Boot backend.
import { api, isBackendAuthenticated } from '@/api/client';

export const DEFAULT_MODEL = 'gemini-3.8-flash';
export const hasGemini = isBackendAuthenticated;

function makePayload({ prompt, snapshot, history }) {
  const context = snapshot ? {
    syntheticDemoData: Boolean(snapshot.syntheticDemoData),
    adherencePercent: snapshot.percent ?? null,
    doses: (snapshot.doses ?? []).map((dose) => ({
      medicine: dose.medicine,
      time: dose.time,
      dose: dose.dose,
      status: dose.status,
    })),
    supply: (snapshot.supply ?? []).map((item) => ({
      medicine: item.medicine,
      quantity: item.quantity,
      daysLeft: item.daysLeft ?? null,
      lowStock: item.lowStock ?? false,
    })),
    expiring: (snapshot.expiring ?? []).map((item) => ({
      medicine: item.medicine,
      daysLeft: item.daysLeft,
    })),
    activePrescriptions: (snapshot.activePrescriptions ?? []).map((prescription) => ({
      doctor: prescription.doctor,
      items: (prescription.items ?? []).map((item) =>
        `${item.medicine} ${item.dosageAmount} ${item.dosageUnit} ${item.frequency}`
      ),
    })),
    dataNotes: snapshot.dataNotes ?? [],
  } : null;

  return {
    message: prompt.trim(),
    history: history.slice(-8).filter((message) => message?.text).map((message) => ({
      role: message.role === 'user' ? 'USER' : 'ASSISTANT',
      text: String(message.text).slice(0, 1200),
    })),
    context: context ? JSON.stringify(context).slice(0, 12000) : null,
  };
}

export async function askGemini({ prompt, snapshot = null, history = [], demo = false }) {
  const payload = makePayload({ prompt, snapshot, history });
  const result = demo
    ? await api.geminiDemoChat(payload)
    : await api.geminiChat(payload);

  if (typeof result?.answer !== 'string' || !result.answer.trim()) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }
  return result.answer.trim();
}

export async function polishSummary(snapshot, baseText) {
  return askGemini({
    snapshot,
    prompt: `Rewrite this tracking summary in plain language. Preserve every fact and number. Do not add medical advice:\n${baseText}`,
  });
}
