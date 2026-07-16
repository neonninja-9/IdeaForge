/**
 * Vote Service
 * ------------
 * API layer for vote endpoints.
 */

import { apiFetch } from "./apiClient";
import type { VoteToggleResponse } from "../types/idea.types";

const voteService = {
  async toggleVote(ideaId: string): Promise<VoteToggleResponse> {
    return apiFetch<VoteToggleResponse>("/votes/toggle", {
      method: "POST",
      body: JSON.stringify({ ideaId }),
    });
  },
};

export default voteService;
