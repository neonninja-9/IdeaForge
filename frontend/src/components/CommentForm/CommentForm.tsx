"use client";

import { useActionState, useEffect, useRef } from "react";
import { postCommentAction } from "@/app/ideas/[id]/comment-actions";

export default function CommentForm({ ideaId }: { ideaId: string }) {
  const [state, dispatch, isPending] = useActionState(
    (prevState: unknown, formData: FormData) => postCommentAction(ideaId, prevState, formData),
    undefined
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="mb-8 bg-white border border-edge rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Leave a Comment</h3>
      <form ref={formRef} action={dispatch} className="space-y-4">
        {state?.error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
            {state.error}
          </div>
        )}
        <label htmlFor="comment-text" className="sr-only">Comment</label>
        <textarea
          id="comment-text"
          name="text"
          rows={3}
          required
          placeholder="Share your thoughts, feedback, or suggestions..."
          className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 resize-none"
        ></textarea>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-fg text-fg-on-dark font-semibold rounded-xl hover:bg-vivid transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
