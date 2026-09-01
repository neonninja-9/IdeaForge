import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffaeb] p-4 text-center">
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-700 mb-6">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#fa520f] text-white rounded-xl font-medium hover:bg-[#cc3a05] transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
