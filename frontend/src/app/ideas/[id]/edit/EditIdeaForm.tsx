"use client";

import { useActionState } from "react";
import { editIdeaAction } from "./actions";
import type { Category, Idea, IdeaTag, Tag } from "@prisma/client";

type IdeaWithTags = Idea & {
  tags: IdeaTag[];
};

export default function EditIdeaForm({ categories, tags, idea }: { categories: Category[], tags: Tag[], idea: IdeaWithTags }) {
  const [state, dispatch, isPending] = useActionState(
    (prevState: unknown, formData: FormData) => editIdeaAction(prevState, formData),
    undefined
  );

  const defaultData = {
    title: (state?.data?.title as string) || idea.title,
    problem: (state?.data?.problem as string) || idea.problem,
    solution: (state?.data?.solution as string) || idea.solution,
    impact: (state?.data?.impact as string) || idea.impact,
    difficulty: (state?.data?.difficulty as string) || idea.difficulty,
    categoryId: (state?.data?.categoryId as string) || idea.categoryId,
    tags: (state?.data?.tags as string[]) || idea.tags.map((t) => t.tagId),
  };

  return (
    <div className="bg-white border border-edge rounded-3xl p-8 shadow-sm">
      {state?.error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
          {state.error}
        </div>
      )}

      <form action={dispatch} className="space-y-6">
        <input type="hidden" name="id" value={idea.id} />
        
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="title">Idea Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={defaultData.title}
            className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50"
            placeholder="e.g. AI-Based Crop Disease Detection"
          />
          {state?.fields?.title && <p className="text-red-500 text-xs mt-1">{state.fields.title[0]}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="categoryId">Category <span className="text-red-500">*</span></label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={defaultData.categoryId}
              className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 appearance-none"
            >
              <option value="">Select a category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {state?.fields?.categoryId && <p className="text-red-500 text-xs mt-1">{state.fields.categoryId[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="difficulty">Difficulty <span className="text-red-500">*</span></label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={defaultData.difficulty}
              className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 appearance-none"
            >
              <option value="">Select difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {state?.fields?.difficulty && <p className="text-red-500 text-xs mt-1">{state.fields.difficulty[0]}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Tags (Select 1-5) <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-2 p-4 bg-surface-alt border border-edge rounded-xl max-h-48 overflow-y-auto">
            {tags.map(t => (
              <label key={t.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-edge cursor-pointer hover:border-vivid transition-colors">
                <input
                  type="checkbox"
                  name="tags"
                  value={t.id}
                  defaultChecked={Array.isArray(defaultData.tags) && defaultData.tags.includes(t.id)}
                  className="w-4 h-4 text-vivid focus:ring-vivid"
                />
                <span className="text-sm font-medium">{t.name}</span>
              </label>
            ))}
          </div>
          {state?.fields?.tags && <p className="text-red-500 text-xs mt-1">{state.fields.tags[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="problem">The Problem <span className="text-red-500">*</span></label>
          <textarea
            id="problem"
            name="problem"
            rows={4}
            defaultValue={defaultData.problem}
            className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 resize-none"
          ></textarea>
          {state?.fields?.problem && <p className="text-red-500 text-xs mt-1">{state.fields.problem[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="solution">Proposed Solution <span className="text-red-500">*</span></label>
          <textarea
            id="solution"
            name="solution"
            rows={4}
            defaultValue={defaultData.solution}
            className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 resize-none"
          ></textarea>
          {state?.fields?.solution && <p className="text-red-500 text-xs mt-1">{state.fields.solution[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="impact">Expected Impact (Optional)</label>
          <textarea
            id="impact"
            name="impact"
            rows={2}
            defaultValue={defaultData.impact || ""}
            className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 resize-none"
          ></textarea>
          {state?.fields?.impact && <p className="text-red-500 text-xs mt-1">{state.fields.impact[0]}</p>}
        </div>

        <div className="pt-4 border-t border-edge flex justify-end gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 bg-fg text-fg-on-dark font-semibold rounded-xl hover:bg-vivid transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
