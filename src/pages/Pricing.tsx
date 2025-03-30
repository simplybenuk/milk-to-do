
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const Pricing = () => {
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
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-milk-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-milk-500 ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Up to 50 tasks</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Basic prioritization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Task expiry tracking</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start for Free</Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-emerald-500 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$5</span>
                  <span className="text-milk-500 ml-2">/ month</span>
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
                    <span>Advanced prioritization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Custom task expiry dates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Analytics and insights</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Upgrade to Pro</Button>
              </CardFooter>
            </Card>

            {/* Team Plan */}
            <Card className="border-2 border-milk-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Team</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-milk-500 ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Task assignment</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Team analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Contact Sales</Button>
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
