"use client";

import { useTransition } from "react";
import { deleteIdeaAction } from "@/app/ideas/[id]/edit/actions";

export default function DeleteIdeaButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this idea? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deleteIdeaAction(id);
        } catch {
          alert("Failed to delete idea.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold rounded-xl text-sm transition-colors"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
