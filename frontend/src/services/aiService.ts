import { apiFetch } from "./apiClient";

export interface AiConversation {
  _id: string;
  id?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiMessage {
  _id: string;
  id?: string;
  conversation: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
}

const aiService = {
  assist: (message: string, context?: { ideaTitle?: string }) =>
    apiFetch<{ status: "success"; data: { message: string; provider: string } }>("/ai/assist", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    }),

  structureIdea: (rawText: string) =>
    apiFetch<{ status: "success"; data: { title: string; problem: string; solution: string; impact: string; difficulty: string; suggestedTechStack: string } }>("/ai/structure-idea", {
      method: "POST",
      body: JSON.stringify({ rawText }),
    }),

  categorizeIdea: (title: string, problem: string, solution: string, impact: string) =>
    apiFetch<{ status: "success"; data: { categoryId: string; difficulty: string; tagIds: string[] } }>("/ai/categorize", {
      method: "POST",
      body: JSON.stringify({ title, problem, solution, impact }),
    }),


  getConversations: () =>
    apiFetch<{ status: "success"; data: { conversations: AiConversation[] } }>("/ai/conversations", {
      method: "GET",
    }),

  createConversation: (title?: string) =>
    apiFetch<{ status: "success"; data: { conversation: AiConversation; initialMessage: AiMessage } }>("/ai/conversations", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  getMessages: (conversationId: string) =>
    apiFetch<{ status: "success"; data: { messages: AiMessage[] } }>(`/ai/conversations/${conversationId}/messages`, {
      method: "GET",
    }),

  sendMessage: (conversationId: string, text: string) =>
    apiFetch<{ status: "success"; data: { userMessage: AiMessage; assistantMessage: AiMessage } }>(
      `/ai/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ text }),
      }
    ),
};

export default aiService;
