/**
 * Idea Service
 * ------------
 * API layer for all idea endpoints.
 */

import { apiFetch } from "./apiClient";
import type {
  IdeasListResponse,
  IdeaDetailResponse,
  DashboardResponse,
  CreateIdeaPayload,
  MyIdeasResponse,
} from "../types/idea.types";

const ideaService = {
  async getIdeas(params: {
    q?: string;
    category?: string;
    tag?: string;
    difficulty?: string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<IdeasListResponse> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set("q", params.q);
    if (params.category) searchParams.set("category", params.category);
    if (params.tag) searchParams.set("tag", params.tag);
    if (params.difficulty) searchParams.set("difficulty", params.difficulty);
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));

    const qs = searchParams.toString();
    return apiFetch<IdeasListResponse>(`/ideas${qs ? `?${qs}` : ""}`);
  },

  async getIdeaById(id: string): Promise<IdeaDetailResponse> {
    return apiFetch<IdeaDetailResponse>(`/ideas/${id}`);
  },

  async createIdea(data: CreateIdeaPayload): Promise<{ status: string; data: { idea: unknown } }> {
    return apiFetch("/ideas", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateIdea(id: string, data: Partial<CreateIdeaPayload>): Promise<{ status: string; data: { idea: unknown } }> {
    return apiFetch(`/ideas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteIdea(id: string): Promise<{ status: string; message: string }> {
    return apiFetch(`/ideas/${id}`, { method: "DELETE" });
  },

  async getDashboard(params?: { page?: number; limit?: number }): Promise<DashboardResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<DashboardResponse>(`/ideas/dashboard${qs ? `?${qs}` : ""}`);
  },

  async getMyIdeas(params?: { page?: number; limit?: number }): Promise<MyIdeasResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<MyIdeasResponse>(`/ideas/my${qs ? `?${qs}` : ""}`);
  },
};

export default ideaService;
