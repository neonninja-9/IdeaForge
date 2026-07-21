import { apiFetch } from "./apiClient";

const aiService = {
  assist: (message: string, context?: { ideaTitle?: string }) =>
    apiFetch<{ status: "success"; data: { message: string; provider: string } }>("/ai/assist", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    }),
};

export default aiService;
