
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";

// Pages
import Index from "./pages/Index";
import PeoplePage from "./pages/PeoplePage";
import TasksPage from "./pages/TasksPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ExemptionsPage from "./pages/ExemptionsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

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
  document.documentElement.classList.remove('light');
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/exemptions" element={<ExemptionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
