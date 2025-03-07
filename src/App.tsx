
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import { logger } from "@/lib/logger";

// Pages
import Index from "./pages/Index";
import PeoplePage from "./pages/PeoplePage";
import TasksPage from "./pages/TasksPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ExemptionsPage from "./pages/ExemptionsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Polyfill Buffer to prevent JWT errors in browser
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

// Configure query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: unknown) => {
          logger.error('Query error:', { 
            module: 'QueryClient',
            data: error 
          });
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: unknown) => {
          logger.error('Mutation error:', { 
            module: 'QueryClient',
            data: error 
          });
        }
      }
    }
  }
});

// Log application startup
logger.info('Application starting up', { module: 'App' });

// Determine if using HashRouter for preview environment
const shouldUseHashRouter = () => {
  const hostname = window.location.hostname;
  // Use HashRouter in preview environment to avoid path issues
  return hostname.includes('preview--') && hostname.includes('lovable.app');
};

// Debug info
console.log('Environment info:', {
  hostname: window.location.hostname,
  pathname: window.location.pathname,
  href: window.location.href,
  usingHashRouter: shouldUseHashRouter()
});

const Router = shouldUseHashRouter() ? HashRouter : BrowserRouter;

// Apply dark mode by default
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
}

const App = () => {
  // If we're in development mode, bypass the JWT errors
  if (process.env.NODE_ENV === 'development') {
    console.warn('Running in development mode - bypassing JWT validation');
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/people" element={
                    <ProtectedRoute>
                      <PeoplePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/tasks" element={
                    <ProtectedRoute>
                      <TasksPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/departments" element={
                    <ProtectedRoute>
                      <DepartmentsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/exemptions" element={
                    <ProtectedRoute>
                      <ExemptionsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </TooltipProvider>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
