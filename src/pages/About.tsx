
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';

const About = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-header">About SourList</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-milk-600">
            Our mission is to help you complete tasks before they go sour.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="mb-4">
              SourList was born out of frustration with traditional to-do lists that grow endlessly and never 
              seem to get completed. We realized that without deadlines or prioritization, tasks tend to 
              accumulate and become overwhelming.
            </p>
            <p className="mb-4">
              So we created a solution: a to-do list where tasks expire after 30 days, just like milk in your 
              refrigerator. This simple concept drives users to complete tasks before they "go sour," making 
              task management more effective and less stressful.
            </p>
            <p className="mb-8">
              Today, SourList helps thousands of users stay on top of their tasks by focusing on what's truly 
              important and time-sensitive.
            </p>

            <h2 className="text-3xl font-bold mb-6">Our Philosophy</h2>
            <p className="mb-4">
              We believe that productivity tools should reduce stress, not add to it. That's why we've designed 
              SourList to focus on a few key principles:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-8">
              <li>
                <strong>Focus on what matters:</strong> By adding an expiry date to tasks, we help you 
                prioritize what truly needs your attention.
              </li>
              <li>
                <strong>Break it down:</strong> Large tasks are overwhelming. SourList encourages breaking 
                them into smaller, manageable pieces.
              </li>
              <li>
                <strong>One task at a time:</strong> Our Focus Mode helps you concentrate on a single task, 
                improving productivity and completion rates.
              </li>
              <li>
                <strong>Smart, not just simple:</strong> Behind the clean interface lies a sophisticated 
                prioritization algorithm that helps you work on the right tasks at the right time.
              </li>
            </ul>

            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="mb-8">
              We're constantly evolving SourList based on user feedback and needs. Join our growing community 
              of productive individuals and teams who are getting more done with less stress.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-fresh-bg to-fresh-accent/20 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-header">Ready to join us?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Start organizing your tasks today and never let them expire again.</p>
          <Link to="/auth">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-6 rounded-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
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

export default About;
