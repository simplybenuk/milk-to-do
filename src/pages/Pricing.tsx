
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import useTaskStore from '@/stores/useTaskStore';

const Pricing = () => {
  const { hasProAccess, userSubscription } = useTaskStore();
  const isProUser = hasProAccess();
  
  return (
    <div className="min-h-screen bg-fresh-bg flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/">
          <AppLogo size="medium" />
        </Link>
        <div className="flex gap-4">
          <Link to="/auth">
            <Button variant="outline" className="border-milk-600 text-milk-800">
              Login
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-milk-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-header">Simple Pricing</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-milk-600">
            Choose the plan that works best for you and your tasks.
          </p>
          {isProUser && (
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-md">
              You're currently on the Pro plan
            </div>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-milk-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£0</span>
                  <span className="text-milk-500 ml-2">/ forever</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Unlimited tasks</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Basic task management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Task expiry tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Task prioritization</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  disabled={!isProUser}
                >
                  {isProUser ? "Downgrade to Free" : "Current Plan"}
                </Button>
              </CardFooter>
            </Card>

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
                  disabled={isProUser}
                >
                  {isProUser ? "Current Plan" : "Upgrade to Pro"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-milk-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <AppLogo size="small" />
              <p className="mt-2 text-milk-300 text-sm">© 2023 SourList. All rights reserved.</p>
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

export default Pricing;
