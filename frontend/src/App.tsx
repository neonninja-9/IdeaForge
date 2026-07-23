import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import AppShell from "./components/AppShell/AppShell";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import TrustedBy from "./components/TrustedBy/TrustedBy";
import CoreCapabilities from "./components/CoreCapabilities/CoreCapabilities";
import ThreeStages from "./components/ThreeStages/ThreeStages";
import SocialProof from "./components/SocialProof/SocialProof";
import CTABanner from "./components/CTABanner/CTABanner";
import { useAuth } from "./hooks/useAuth";
import ClickEffects from "./components/ClickEffects/ClickEffects";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const IdeasFeedPage = lazy(() => import("./pages/IdeasFeedPage"));
const IdeaDetailPage = lazy(() => import("./pages/IdeaDetailPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const SubmitIdeaPage = lazy(() => import("./pages/SubmitIdeaPage"));
const EditIdeaPage = lazy(() => import("./pages/EditIdeaPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AIStudioPage = lazy(() => import("./pages/AIStudioPage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function LandingPage() {
  const { user, isLoading } = useAuth();

  // The landing experience is public-only. Once signed in, visitors enter the
  // product workspace instead of falling back into marketing content.
  if (isLoading) return <div className="min-h-screen bg-white" />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <TrustedBy />
      <CoreCapabilities />
      <ThreeStages />
      <SocialProof />
      <CTABanner />
    </main>
  );
}

/**
 * Public marketing and the authenticated workspace deliberately have separate
 * layouts. The workspace retains its shell while its internal views change.
 */
function LandingLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16"><Outlet /></div>
      <Footer />
    </div>
  );
}

function WorkspaceLayout() {
  return <AppShell />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="font-sans antialiased bg-surface flex flex-col min-h-screen">
          <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#fafaf8]" aria-busy="true" aria-label="Loading page"><div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm"><span className="size-2 animate-pulse rounded-full bg-indigo-500" /> Loading your workspace…</div></div>}>
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
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/ai-studio" element={<AIStudioPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
          <ClickEffects />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
