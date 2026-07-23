import { apiFetch } from "./apiClient";

export interface FavoritesResponse {
  status: string;
  data: {
    favorites: string[];
  };
}

const favoriteService = {
  getFavorites: () => apiFetch<FavoritesResponse>("/favorites", { method: "GET" }),
  addFavorite: (ideaId: string) => apiFetch(`/favorites/${ideaId}`, { method: "POST" }),
  removeFavorite: (ideaId: string) => apiFetch(`/favorites/${ideaId}`, { method: "DELETE" }),
};

export default favoriteService;
