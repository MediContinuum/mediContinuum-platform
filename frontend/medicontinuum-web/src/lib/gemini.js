// Gemini requests are sent through the Spring Boot API. The API key never reaches the browser.
import { api } from '@/api/client';

export const DEFAULT_MODEL = 'gemini-3.8-flash';

export async function askGemini({ prompt, snapshot, history = [] }) {
  const context = {
    adherencePercent: snapshot?.percent ?? 0,
    doses: (snapshot?.doses ?? []).map((dose) => ({
      medicine: dose.medicine, time: dose.time, dose: dose.dose, status: dose.status,
    })),
    supply: snapshot?.supply ?? [],
    expiring: (snapshot?.expiring ?? []).map((item) => ({ medicine: item.medicine, daysLeft: item.daysLeft })),
    activePrescriptions: (snapshot?.activePrescriptions ?? []).map((prescription) => ({
      doctor: prescription.doctor,
      items: (prescription.items ?? []).map((item) =>
        `${item.medicine} ${item.dosageAmount} ${item.dosageUnit} ${item.frequency}`
      ),
    })),
  };
  const result = await api.geminiChat({
    message: prompt,
    history: history.slice(-8).map((message) => ({
      role: message.role === 'user' ? 'USER' : 'ASSISTANT',
      text: message.text,
    })),
    context: JSON.stringify(context).slice(0, 12000),
  });
  return result.answer;
}

export async function polishSummary(snapshot, baseText) {
  return askGemini({
    snapshot,
    prompt: `Rewrite this tracking summary in plain language. Keep all clinical facts and numbers unchanged:\n${baseText}`,
  });
}
