import { apiFetch } from "./apiClient";
import type { FavoritesResponse } from "../types/idea.types";

const favoriteService = {
  getFavorites: (params?: { populate?: boolean }) => {
    const query = params?.populate ? "?populate=true" : "";
    return apiFetch<FavoritesResponse>(`/favorites${query}`, { method: "GET" });
  },
  addFavorite: (ideaId: string) => apiFetch<{ status: string }>(`/favorites/${ideaId}`, { method: "POST" }),
  removeFavorite: (ideaId: string) => apiFetch<{ status: string }>(`/favorites/${ideaId}`, { method: "DELETE" }),
};

export default favoriteService;
