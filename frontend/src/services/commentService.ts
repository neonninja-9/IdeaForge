/**
 * Comment Service
 * ---------------
 * API layer for comment endpoints.
 */

import { apiFetch } from "./apiClient";
import type { CommentsResponse, Comment } from "../types/idea.types";

const commentService = {
  async getComments(ideaId: string): Promise<CommentsResponse> {
    return apiFetch<CommentsResponse>(`/comments?ideaId=${ideaId}`);
  },

  async addComment(ideaId: string, text: string): Promise<{ status: string; data: { comment: Comment } }> {
    return apiFetch("/comments", {
      method: "POST",
      body: JSON.stringify({ ideaId, text }),
    });
  },

  async deleteComment(id: string): Promise<{ status: string; message: string }> {
    return apiFetch(`/comments/${id}`, { method: "DELETE" });
  },
};

export default commentService;
