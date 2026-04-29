"use client";

import { useEffect } from "react";

export default function ExploreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 text-center">
      <div className="bg-red-50 text-red-800 p-8 rounded-3xl inline-block max-w-xl border border-red-100">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="mb-6 opacity-80">
          We couldn&apos;t load the ideas at this time. Please try again later.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
