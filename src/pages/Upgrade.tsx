
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

const Upgrade = () => {
  const { trackPageView, trackButtonClick } = useAnalytics();

  // Track page view when component mounts
  useEffect(() => {
    trackPageView('upgrade_page');
  }, [trackPageView]);

  const handleBackToAppClick = () => {
    trackButtonClick('back_to_app');
  };

  const handleContinueFreeClick = () => {
    trackButtonClick('continue_free');
  };

  const handleUpgradeClick = () => {
    trackButtonClick('upgrade_to_pro');
  };

  return (
    <div className="min-h-screen bg-fresh-bg flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/">
          <AppLogo size="medium" />
        </Link>
        <Link to="/">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleBackToAppClick}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-milk-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-header">Upgrade to Pro</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-milk-600">
            Unlock all features and get the most out of SourList
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Pro Plan */}
            <Card className="border-2 border-emerald-500 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <div className="mt-4 flex flex-col space-y-2">
                  <div>
                    <span className="text-4xl font-bold">£2</span>
                    <span className="text-milk-500 ml-2">/ month</span>
                  </div>
                  <div className="text-sm text-milk-500">
                    or <span className="font-semibold text-emerald-600">£20</span> / year (save £4)
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Edit tasks</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Split tasks into smaller steps</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Advanced analytics and insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Task performance metrics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleUpgradeClick}
                >
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-8 text-center">
              <Link 
                to="/" 
                className="text-milk-600 hover:text-milk-800 underline"
                onClick={handleContinueFreeClick}
              >
                Continue with Free Plan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upgrade;
