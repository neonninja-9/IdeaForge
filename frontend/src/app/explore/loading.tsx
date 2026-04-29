export default function ExploreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 md:py-16">
      <div className="mb-10">
        <div className="h-12 bg-surface-alt w-64 rounded-lg animate-pulse mb-4"></div>
        <div className="h-6 bg-surface-alt w-96 rounded-lg animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white border border-edge rounded-2xl p-6 h-64 animate-pulse">
            <div className="h-6 bg-surface-alt w-24 rounded-full mb-4"></div>
            <div className="h-8 bg-surface-alt w-3/4 rounded-lg mb-6"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-surface-alt w-full rounded-lg"></div>
              <div className="h-4 bg-surface-alt w-5/6 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
