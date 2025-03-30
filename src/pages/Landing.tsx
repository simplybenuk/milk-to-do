import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';

const Landing = () => {
  return (
    <div className="min-h-screen bg-fresh-bg flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <AppLogo size="medium" />
        <div className="flex gap-4">
          <Link to="/auth">
            <Button variant="outline" className="border-milk-600 text-milk-800">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center container mx-auto px-4 py-12 md:py-24">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-header">
            A to-do list with an
            <span className="text-expired-accent"> expiration date</span>
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-milk-600">
            Tasks go sour after 30 days
          </p>
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-6 rounded-lg"
            >
              Get Started
            </Button>
          </Link>
          <h2 className="text-3xl md:text-5xl font-bold mt-16 md:mt-24 font-header">
            Tasks go sour.
            <br />
            Stay fresh.
          </h2>
        </div>

        <div className="md:w-1/2 relative">
          {/* Refrigerator SVG */}
          <div className="relative w-full max-w-md mx-auto">
            <svg className="w-full" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Refrigerator body */}
              <rect x="50" y="50" width="300" height="400" rx="20" fill="#E1E2E6" stroke="#333" strokeWidth="6" />
              <rect x="60" y="60" width="280" height="380" rx="10" fill="#F1F0FB" stroke="#333" strokeWidth="3" />
              
              {/* Refrigerator division line */}
              <line x1="60" y1="200" x2="340" y2="200" stroke="#333" strokeWidth="3" />
              
              {/* Refrigerator handle */}
              <rect x="320" y="100" width="20" height="80" rx="5" fill="#666" />
              <rect x="320" y="300" width="20" height="80" rx="5" fill="#666" />
              
              {/* Refrigerator feet */}
              <rect x="80" y="450" width="40" height="10" rx="2" fill="#555" />
              <rect x="280" y="450" width="40" height="10" rx="2" fill="#555" />
            </svg>

            {/* Task cards positioned inside the refrigerator */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pt-20">
              {/* Milk carton with face */}
              <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg width="80" height="100" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 14L8 56C8 58.2091 9.79086 60 12 60H36C38.2091 60 40 58.2091 40 56V14L34 4H14L8 14Z" fill="#d1f3d9" stroke="#333" strokeWidth="2" />
                  <path d="M8 14H40" stroke="#333" strokeWidth="2" />
                  <rect x="12" y="22" width="24" height="18" rx="2" fill="#b6ebc9" />
                  <circle cx="24" cy="31" r="8" fill="#FFFFFF" />
                  <path d="M20 31L20 29M28 31L28 29" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 36C22 38 26 38 28 36" stroke="#333" strokeWidth="1.5" strokeLinecap="round" transform="scale(1,-1) translate(0,-72)" />
                </svg>
              </div>

              {/* Fresh task */}
              <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 w-3/4 max-w-[220px] bg-fresh-bg rounded-xl p-4 border-2 border-fresh-accent shadow-md">
                <h3 className="font-semibold text-lg">Write a blog post</h3>
                <div className="flex items-center mt-1 mb-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-sm font-medium">Fresh</span>
                  <span className="text-sm ml-2">12 days</span>
                </div>
                <p className="text-sm text-milk-700">Expires in 12 days</p>
              </div>

              {/* Spoiling task */}
              <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 w-3/4 max-w-[220px] bg-spoiling-bg rounded-xl p-4 border-2 border-spoiling-accent/40 shadow-md">
                <h3 className="font-semibold text-lg">Schedule appointment</h3>
                <div className="flex items-center mt-1 mb-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm font-medium">Spoiling</span>
                </div>
                <p className="text-sm text-milk-700">Expires in 7 days</p>
              </div>

              {/* Sour task */}
              <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 w-3/4 max-w-[220px] bg-sour-bg rounded-xl p-4 border-2 border-sour-accent/40 shadow-md">
                <h3 className="font-semibold text-lg">Reply to emails</h3>
                <div className="flex items-center mt-1 mb-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-sm font-medium">Sour</span>
                </div>
                <p className="text-sm text-milk-700">Expires in 3 days</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-milk-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-header">Why SourList Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-fresh-bg rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🥛</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Task Expiry</h3>
              <p className="text-milk-600">Tasks have a 30-day expiry date, encouraging you to complete them before they go sour.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-fresh-bg rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Prioritization</h3>
              <p className="text-milk-600">Tasks are automatically prioritized based on urgency and expiration date.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-fresh-bg rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Focus Mode</h3>
              <p className="text-milk-600">Focus on one task at a time to increase productivity and task completion.</p>
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

      {/* Footer */}
      <footer className="bg-milk-800 text-white py-8">
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

export default Landing;
