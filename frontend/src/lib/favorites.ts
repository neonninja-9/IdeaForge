const storageKey = "ideaforge-favorite-idea-ids";

function readIds(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function getFavoriteIdeaIds() {
  return readIds();
}

export function isFavoriteIdea(id: string) {
  return readIds().includes(id);
}

export function toggleFavoriteIdea(id: string) {
  const ids = readIds();
  const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
  window.localStorage.setItem(storageKey, JSON.stringify(next));
  return next.includes(id);
}
