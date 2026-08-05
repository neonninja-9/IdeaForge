/**
 * Category Service
 * ----------------
 * API layer for category endpoints.
 */

import { apiFetch } from "./apiClient";
import type { CategoriesResponse } from "../types/idea.types";

const categoryService = {
  async getCategories(options: { signal?: AbortSignal } = {}): Promise<CategoriesResponse> {
    return apiFetch<CategoriesResponse>("/categories", {
      signal: options.signal,
    });
  },
};

export default categoryService;
