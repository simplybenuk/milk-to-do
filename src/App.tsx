
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

// Check for auth tokens in URL (for OAuth redirects like Google login)
const checkForAuthTokens = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return false;
  
  const hash = window.location.hash;
  const query = new URLSearchParams(window.location.search);
  
  // Check if we have auth tokens in the URL (after OAuth redirect)
  return !!(
    hash.includes('access_token=') || 
    hash.includes('refresh_token=') ||
    query.has('access_token') ||
    query.has('refresh_token')
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle auth redirects
  useEffect(() => {
    console.log('PrivateRoute - Current path:', location.pathname);
    
    const hasAuthTokens = checkForAuthTokens();
    console.log('Auth tokens in URL:', hasAuthTokens);
    
    // If we have auth tokens in the URL, navigate to /app
    if (hasAuthTokens && location.pathname === '/') {
      console.log("Auth tokens detected in URL, redirecting to /app");
      navigate('/app', { replace: true });
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session check result:', !!session);
      setSession(!!session);
      
      // If user is authenticated and still on landing page, redirect to app
      if (session && location.pathname === '/') {
        console.log('User authenticated, redirecting from landing to app');
        navigate('/app', { replace: true });
      }
    }).catch(error => {
      console.error('Error getting session:', error);
      setSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed - Event:', event);
      const isAuthenticated = !!session;
      setSession(isAuthenticated);
      
      // If user just authenticated and on landing or auth page, redirect to app
      if (isAuthenticated && (location.pathname === '/' || location.pathname === '/auth')) {
        console.log('Auth state change - redirecting to app');
        navigate('/app', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, navigate]);

  if (session === null) {
    console.log('PrivateRoute - Loading state');
    return null; // Loading state
  }

  console.log('PrivateRoute - Session state:', session);
  return session ? <>{children}</> : <Navigate to="/auth" replace />;
};

const App = () => {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/app"
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
