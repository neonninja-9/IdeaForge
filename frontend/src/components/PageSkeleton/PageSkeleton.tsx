type SkeletonVariant = "dashboard" | "feed" | "detail" | "profile" | "form";

function Block({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-edge/60 ${className}`} />;
}

export default function PageSkeleton({ variant }: { variant: SkeletonVariant }) {
  if (variant === "detail") {
    return <main className="min-h-[calc(100vh-76px)] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8"><Block className="h-3 w-32" /><div className="max-w-3xl space-y-5"><Block className="h-6 w-28" /><Block className="h-12 w-11/12" /><Block className="h-16 w-full" /><Block className="h-40 w-full" /><Block className="h-32 w-10/12" /></div></main>;
  }

  if (variant === "dashboard") {
    return <main className="min-h-[calc(100vh-76px)] max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-10 sm:py-14"><Block className="h-9 w-40" /><Block className="mt-3 h-4 w-56" /><div className="mt-10 grid gap-5 md:grid-cols-3">{[1, 2, 3].map((item) => <Block key={item} className="h-32" />)}</div><Block className="mt-12 h-6 w-32" /><div className="mt-5 grid gap-4 md:grid-cols-2">{[1, 2].map((item) => <Block key={item} className="h-48" />)}</div></main>;
  }

  if (variant === "profile") {
    return <main className="min-h-[calc(100vh-76px)] max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14"><Block className="h-64" /><div className="mt-10 grid gap-4 sm:grid-cols-2"><Block className="h-44" /><Block className="h-44" /></div></main>;
  }

  if (variant === "form") {
    return <main className="min-h-[calc(100vh-76px)] mx-auto max-w-[720px] px-5 py-10 sm:py-14"><Block className="mx-auto h-9 w-56" /><Block className="mx-auto mt-3 h-4 w-96 max-w-full" /><div className="mt-10 space-y-6 rounded-2xl border border-edge bg-white p-8"><Block className="h-12 w-full" /><Block className="h-12 w-full" /><Block className="h-32 w-full" /><Block className="h-32 w-full" /></div></main>;
  }

  return <div className="min-h-[calc(100vh-76px)] grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-5 sm:p-8 xl:p-12"><div className="col-span-full mb-4"><Block className="h-10 w-64" /><Block className="mt-2 h-4 w-96" /></div>{[1, 2, 3, 4, 5, 6].map((item) => <Block key={item} className="h-64" />)}</div>;
}
