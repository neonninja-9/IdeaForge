import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import CoreCapabilities from "./components/CoreCapabilities";
import ThreeStages from "./components/ThreeStages";
import SocialProof from "./components/SocialProof";
import CTABanner from "./components/CTABanner";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import IdeasFeedPage from "./pages/IdeasFeedPage";
import IdeaDetailPage from "./pages/IdeaDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import SubmitIdeaPage from "./pages/SubmitIdeaPage";
import { useAuth } from "./hooks/useAuth";

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
  return (
    <div className="min-h-screen bg-surface-alt flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="font-sans antialiased bg-surface flex flex-col min-h-screen">
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
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
