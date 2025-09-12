
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { useAnalytics } from '@/hooks/useAnalytics';

const Privacy = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('privacy_policy');
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/">
          <AppLogo size="medium" />
        </Link>
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="outline" className="border-milk-600 text-milk-800">
              Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
            <p className="mb-4">
              This Privacy Policy describes how SourList ("we", "our", or "us") collects, uses, and shares your information when you use our service.
            </p>
            <p className="mb-4">
              Your privacy is important to us. It is our policy to respect your privacy and comply with applicable laws and regulations regarding any personal information we may collect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <p className="mb-4">We collect several types of information, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <span className="font-medium">Account Information:</span> When you register, we collect your email address and secure your password.
              </li>
              <li className="mb-2">
                <span className="font-medium">Usage Data:</span> If you've consented to analytics, we collect information about how you interact with our service, such as tasks created, completed, or skipped.
              </li>
              <li className="mb-2">
                <span className="font-medium">Technical Information:</span> With your consent, we may collect information about your device and how you access our service, including browser type, operating system, and page views.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Provide, maintain, and improve our services</li>
              <li className="mb-2">Understand how you use our service to make improvements</li>
              <li className="mb-2">Communicate with you, including sending service updates</li>
              <li className="mb-2">If you've opted in, send you marketing communications about our products and services</li>
              <li className="mb-2">Monitor and analyze trends and usage to improve user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Analytics</h2>
            <p className="mb-4">
              We use PostHog for analytics to understand how users interact with our service. You can opt out of analytics tracking during signup or later in your account settings. If you opt out, we will not collect any analytics data about your usage of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Marketing Communications</h2>
            <p className="mb-4">
              We only send marketing emails if you've explicitly opted in to receive them. You can opt out at any time by updating your preferences in your account settings or by using the unsubscribe link in our emails.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Access the personal information we hold about you</li>
              <li className="mb-2">Request correction of your personal information</li>
              <li className="mb-2">Request deletion of your personal information</li>
              <li className="mb-2">Object to our processing of your personal information</li>
              <li className="mb-2">Request restriction of processing your personal information</li>
              <li className="mb-2">Request transfer of your personal information</li>
              <li className="mb-2">Withdraw consent at any time, where we rely on consent to process your personal information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@sourlist.app.
            </p>
          </section>

          <div className="mt-8 text-sm text-milk-600">
            Last Updated: April 4, 2025
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <AppLogo size="small" />
              <p className="mt-2 text-milk-300 text-sm">© 2025 SourList. All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-bold mb-2">Product</h3>
                <ul className="text-milk-300 text-sm">
                  <li className="mb-1"><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                  <li className="mb-1"><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">Company</h3>
                <ul className="text-milk-300 text-sm">
                  <li className="mb-1"><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li className="mb-1"><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
