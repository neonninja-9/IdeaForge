import { apiFetch } from "./apiClient";

export type ProjectCanvasResponse = {
  status: "success";
  data: { notes: Record<string, string>; updatedAt: string | null };
};

const projectService = {
  getCanvas: () => apiFetch<ProjectCanvasResponse>("/projects/canvas"),
  saveCanvas: (notes: Record<string, string>) =>
    apiFetch<ProjectCanvasResponse>("/projects/canvas", {
      method: "PUT",
      body: JSON.stringify({ notes }),
    }),
};

export default projectService;
