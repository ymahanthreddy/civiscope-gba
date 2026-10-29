import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { IssueProvider } from "@/contexts/IssueContext";
import { CityProvider } from "@/contexts/CityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIChatbot } from "@/components/chatbot/AIChatbot";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import ReportPage from "./pages/ReportPage";
import TrackPage from "./pages/TrackPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import UserDashboard from "./pages/UserDashboard";
import WorkerPortal from "./pages/WorkerPortal";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center hero-gradient"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl"
        >
          <span className="text-5xl">🏛️</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl md:text-5xl font-display font-bold text-white mb-3"
        >
          Civiscope
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-white/70 text-lg font-light tracking-wider"
        >
          From Complaint to Closure
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
          className="mt-8 h-1 w-48 mx-auto rounded-full bg-white/30 origin-left overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
            className="h-full w-full bg-white rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/worker" element={<WorkerPortal />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CityProvider>
          <IssueProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AnimatePresence>
                {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
              </AnimatePresence>
              {!showSplash && (
                <BrowserRouter>
                  <AppRoutes />
                  <AIChatbot />
                </BrowserRouter>
              )}
            </TooltipProvider>
          </IssueProvider>
        </CityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
