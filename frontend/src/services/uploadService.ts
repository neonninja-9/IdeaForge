import { apiFetch } from "./apiClient";
import type { Attachment } from "../types/idea.types";

interface UploadResponse {
  status: "success";
  data: Attachment;
}

const uploadService = {
  async uploadFile(file: File): Promise<Attachment> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const response = await apiFetch<UploadResponse>("/upload", {
            method: "POST",
            body: JSON.stringify({
              data: base64Data,
              name: file.name,
              type: file.type || "image/png",
            }),
          });
          resolve(response.data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },
};

export default uploadService;
