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
