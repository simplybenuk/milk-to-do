
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { 
  Clock, 
  BarChart, 
  Target, 
  CheckCircle, 
  Calendar, 
  List, 
  SplitSquareVertical,
  Focus,
} from 'lucide-react';

const Features = () => {
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-header">All Features</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-milk-600">
            Discover how SourList helps you stay productive and complete tasks before they expire.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center font-header">Core Features</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-fresh-bg rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Task Expiry</h3>
                <p className="text-milk-600 mb-4">
                  Every to-do item has an expiry date, set to 30 days by default. This motivates completion and helps you focus on what matters.
                </p>
                <p className="text-milk-600">
                  As tasks approach their expiration date, they gain higher priority, ensuring important work doesn't slip through the cracks.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-fresh-bg rounded-full flex items-center justify-center">
                <BarChart className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Dynamic Prioritization</h3>
                <p className="text-milk-600 mb-4">
                  Our intelligent system automatically adjusts task priority based on user-defined importance and time until expiry.
                </p>
                <p className="text-milk-600">
                  Tasks are scored using a sophisticated algorithm that balances your preferences with urgency to create the perfect task order.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-fresh-bg rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Focus Mode</h3>
                <p className="text-milk-600 mb-4">
                  Eliminate distractions with Focus Mode, which presents one task at a time based on your priority rankings.
                </p>
                <p className="text-milk-600">
                  Focus Mode locks in your priority list for the session, helping you work through tasks methodically without getting overwhelmed.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-fresh-bg rounded-full flex items-center justify-center">
                <SplitSquareVertical className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Task Breakdown</h3>
                <p className="text-milk-600 mb-4">
                  Break down large, overwhelming tasks into smaller, more manageable sub-tasks to improve completion rates.
                </p>
                <p className="text-milk-600">
                  Sub-tasks inherit properties from their parent task but can be independently tracked and completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center font-header">More Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <CheckCircle className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Task Tracking</h3>
              <p className="text-milk-600">
                Keep track of your completed tasks and analyze your productivity patterns over time.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <List className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Limited Task View</h3>
              <p className="text-milk-600">
                Focus on immediate priorities instead of being overwhelmed by your entire to-do list.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <Calendar className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Task Age Indicators</h3>
              <p className="text-milk-600">
                Visual indicators show task freshness: fresh, spoiling, or sour, helping you prioritize effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-fresh-bg to-fresh-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-header">Ready to keep your tasks fresh?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Start organizing your tasks today and never let them expire again.</p>
          <Link to="/auth">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-6 rounded-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer (Same as Landing) */}
      <footer className="bg-foreground text-background py-8">
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

export default Features;
