
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";

// Pages
import Index from "./pages/Index";
import PeoplePage from "./pages/PeoplePage";
import TasksPage from "./pages/TasksPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ExemptionsPage from "./pages/ExemptionsPage";
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

// Determine basename for router
const getBasename = () => {
  // Check if we're in a deployment preview environment
  const hostname = window.location.hostname;
  if (hostname.includes('preview--') && hostname.includes('lovable.app')) {
    console.log('Running in preview environment with basename');
    return '/';
  }
  return '/';
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={getBasename()}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/exemptions" element={<ExemptionsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
