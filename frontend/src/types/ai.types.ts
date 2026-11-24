export interface AIRequest {
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AIResponse {
  response: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface AIRecommendation {
  id?: string;
  title: string;
  description: string;
  category?: string;
  confidence?: number;
}

export interface AIRecommendationResponse {
  recommendations: AIRecommendation[];
}

export interface AIChatMessage {
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  timestamp?: string;
}

export interface AIChatRequest {
  messages: AIChatMessage[];
  context?: Record<string, unknown>;
}

export interface AIChatResponse {
  message: AIChatMessage;
  metadata?: Record<string, unknown>;
}
