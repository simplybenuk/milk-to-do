
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CheckCircle2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';

const UpgradeSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { trackPageView, trackEvent } = useAnalytics();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Track page view and session ID when component mounts
  useEffect(() => {
    trackPageView('upgrade_success_page');
    
    if (sessionId) {
      trackEvent('subscription_success', { session_id: sessionId });
    }
    
    // Countdown and redirect to app
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/app');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [trackPageView, trackEvent, sessionId, navigate]);

  return (
    <div className="min-h-screen bg-fresh-bg flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/">
          <AppLogo size="medium" />
        </Link>
      </nav>

      {/* Success Content */}
      <section className="flex-1 flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto border-2 border-emerald-500 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto bg-emerald-100 p-4 inline-block rounded-full mb-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Upgrade Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-milk-600">
                Thank you for upgrading to SourList Pro! Your subscription has been activated.
              </p>
              <ul className="space-y-3 text-left bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                  <span>You now have access to all Pro features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                  <span>Edit and update tasks</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                  <span>Split tasks into smaller, manageable steps</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                  <span>Access advanced analytics and insights</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 mb-2"
                  onClick={() => navigate('/app')}
                >
                  Go to App
                </Button>
                <p className="text-center text-sm text-milk-500">
                  Redirecting in {countdown} seconds...
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default UpgradeSuccess;
