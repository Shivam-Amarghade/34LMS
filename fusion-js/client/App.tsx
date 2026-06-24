import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PlaceholderScreen from "./pages/PlaceholderScreen";
import EmployeeDashboard from "./pages/employee/Dashboard";
import MyCompetencies from "./pages/employee/MyCompetencies";
import CompetencyDetail from "./pages/employee/CompetencyDetail";
import GapAnalysis from "./pages/employee/GapAnalysis";
import MyLearning from "./pages/employee/MyLearning";
import MyCertifications from "./pages/employee/MyCertifications";
import Gamification from "./pages/employee/Gamification";
import NotificationCenter from "./pages/employee/NotificationCenter";
import { Layout } from "./components/layout/Layout";

const queryClient = new QueryClient();

// Route guard component
function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />

    {/* Redirect home to appropriate portal */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Employee Portal */}
    <Route
      path="/employee/dashboard"
      element={
        <ProtectedRoute>
          <EmployeeDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/competencies"
      element={
        <ProtectedRoute>
          <MyCompetencies />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/competency/:code"
      element={
        <ProtectedRoute>
          <CompetencyDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/self-assign"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/learning"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/gap-analysis"
      element={
        <ProtectedRoute>
          <GapAnalysis />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/certifications"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/gamification"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />

    {/* Supervisor Portal */}
    <Route
      path="/supervisor/dashboard"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/supervisor/team"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/supervisor/reports"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />

    {/* Admin Portal */}
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/competencies"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/courses"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/certifications"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/learning-paths"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reports"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />

    {/* Profile */}
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <PlaceholderScreen />
        </ProtectedRoute>
      }
    />

    {/* Catch all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
