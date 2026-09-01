import { apiFetch } from "./apiClient";
import type {
  SolutionResponse,
  SolutionsListResponse,
  SolutionVoteToggleResponse
} from "../types/idea.types";

const solutionService = {
  getSolutions: (ideaId: string) =>
    apiFetch<SolutionsListResponse>(`/ideas/${ideaId}/solutions`),

  addSolution: (ideaId: string, data: { title: string; description: string; techStack?: string }) =>
    apiFetch<SolutionResponse>(`/ideas/${ideaId}/solutions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  toggleVote: (solutionId: string) =>
    apiFetch<SolutionVoteToggleResponse>(`/solutions/${solutionId}/vote`, {
      method: "POST",
    }),
};

export default solutionService;
