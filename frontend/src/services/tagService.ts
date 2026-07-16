/**
 * Tag Service
 * -----------
 * API layer for tag endpoints.
 */

import { apiFetch } from "./apiClient";
import type { TagsResponse } from "../types/idea.types";

const tagService = {
  async getTags(): Promise<TagsResponse> {
    return apiFetch<TagsResponse>("/tags");
  },
};

export default tagService;
