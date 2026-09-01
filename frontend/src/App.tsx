import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./app/providers/AuthProvider";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const AppShell = lazy(() => import("./components/AppShell/AppShell"));
const Footer = lazy(() => import("./components/Footer/Footer"));
const ClickEffects = lazy(() => import("./components/ClickEffects/ClickEffects"));
const LandingPageContent = lazy(() => import("./features/landing/LandingPage"));
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage"));
const IdeasFeedPage = lazy(() => import("./features/ideas/IdeasFeedPage"));
const IdeaDetailPage = lazy(() => import("./features/ideas/IdeaDetailPage"));
const UserProfilePage = lazy(() => import("./features/profile/UserProfilePage"));
const SubmitIdeaPage = lazy(() => import("./features/ideas/SubmitIdeaPage"));
const EditIdeaPage = lazy(() => import("./features/ideas/EditIdeaPage"));
const ProjectsPage = lazy(() => import("./features/projects/ProjectsPage"));
const AIStudioPage = lazy(() => import("./features/ai-studio/AIStudioPage"));
const TemplatesPage = lazy(() => import("./features/ideas/TemplatesPage"));
const FavoritesPage = lazy(() => import("./features/ideas/FavoritesPage"));
const SettingsPage = lazy(() => import("./features/profile/SettingsPage"));
const NotFoundPage = lazy(() => import("./features/errors/NotFoundPage"));

function LandingPage() {
  const { user, isLoading } = useAuth();

  // The landing experience is public-only. Once signed in, visitors enter the
  // product workspace instead of falling back into marketing content.
  if (isLoading) return <div className="min-h-screen bg-[#0C0A09]" />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <LandingPageContent />;
}

/**
 * Public marketing and the authenticated workspace deliberately have separate
 * layouts. The workspace retains its shell while its internal views change.
 */
function LandingLayout() {
  return (
    <div className="min-h-screen bg-[#0C0A09] flex flex-col">
      <Navbar />
      <div className="flex-1"><Outlet /></div>
      <Footer />
    </div>
  );
}

function WorkspaceLayout() {
  return <AppShell />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="font-sans antialiased bg-surface flex flex-col min-h-screen">
            <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#FFFBEB]" aria-busy="true" aria-label="Loading page"><div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm"><span className="size-2 animate-pulse rounded-full bg-[#A16207]" /> Loading your workspace…</div></div>}>
            <Routes>
              {/* Auth pages — full-page immersion, no Navbar/Footer */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Marketing is kept separate from the signed-in application. */}
              <Route element={<LandingLayout />}>
                <Route path="/" element={<LandingPage />} />
              </Route>

              {/* Product views use one persistent workspace shell. */}
              <Route element={<WorkspaceLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/explore" element={<IdeasFeedPage />} />
                <Route path="/idea/:id" element={<IdeaDetailPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/submit" element={<SubmitIdeaPage />} />
                <Route path="/edit-idea/:id" element={<EditIdeaPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/ai-studio" element={<AIStudioPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Suspense fallback={null}>
            <ClickEffects />
          </Suspense>
        </div>
      </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
