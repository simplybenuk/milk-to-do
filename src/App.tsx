
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
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import EmailConfirmation from "./pages/EmailConfirmation";
import Features from "./pages/Features";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Create a new QueryClient with more aggressive config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10000,
    },
  },
});

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
    // This handles both OAuth redirects and email confirmation redirects
    if (hasAuthTokens) {
      console.log("Auth tokens detected in URL, redirecting to /app");
      navigate('/app', { replace: true });
      return;
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session check result:', !!session);
      console.log('Session user ID:', session?.user?.id);
      setSession(!!session);
      
      // If user is authenticated and still on landing page, redirect to app
      if (session && location.pathname === '/') {
        console.log('User authenticated, redirecting from landing to app');
        navigate('/app', { replace: true });
      }
    }).then(
      undefined,
      error => {
        console.error('Error getting session:', error);
        setSession(false);
      }
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed - Event:', event);
      console.log('Auth state changed - User ID:', session?.user?.id);
      const isAuthenticated = !!session;
      setSession(isAuthenticated);
      
      // Handle different auth events
      if (isAuthenticated) {
        // If user just confirmed their email or authenticated in any way
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          console.log('Auth event detected, redirecting to app');
          navigate('/app', { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        // Redirect to landing page on sign out
        navigate('/', { replace: true });
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
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/features" element={<Features />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Routes - Make sure admin and settings are NOT duplicated */}
            <Route
              path="/app/*"
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
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
