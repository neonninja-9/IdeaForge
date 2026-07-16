/**
 * Category Service
 * ----------------
 * API layer for category endpoints.
 */

import { apiFetch } from "./apiClient";
import type { CategoriesResponse } from "../types/idea.types";

const categoryService = {
  async getCategories(): Promise<CategoriesResponse> {
    return apiFetch<CategoriesResponse>("/categories");
  },
};

export default categoryService;
