
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-header">Frequently Asked Questions</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-milk-600">
            Find answers to commonly asked questions about SourList.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card shadow-sm">
              <AccordionTrigger className="text-xl font-semibold py-4">
                What is SourList and how does it work?
              </AccordionTrigger>
              <AccordionContent className="text-milk-600 pb-4">
                SourList is a to-do app that introduces the concept of task expiry to help you prioritize and complete tasks efficiently. 
                Unlike traditional to-do lists that can become overwhelming, SourList focuses you on your immediate priorities. 
                Every task has an expiry date (30 days by default), and the app automatically adjusts priorities based on urgency 
                and your assigned importance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card shadow-sm">
              <AccordionTrigger className="text-xl font-semibold py-4">
                How does the task prioritization system work?
              </AccordionTrigger>
              <AccordionContent className="text-milk-600 pb-4">
                SourList uses a sophisticated algorithm to prioritize tasks based on multiple factors:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Priority Level (High, Medium, Low) – Higher priority tasks are weighted more</li>
                  <li>Expiry Date – Tasks closer to expiry gain higher priority</li>
                  <li>Skip Count – Tasks that are frequently skipped lose priority</li>
                </ul>
                <p className="mt-2">
                  The algorithm calculates a final score for each task, and presents them in order of importance.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card shadow-sm">
              <AccordionTrigger className="text-xl font-semibold py-4">
                What is Focus Mode and how do I use it?
              </AccordionTrigger>
              <AccordionContent className="text-milk-600 pb-4">
                Focus Mode is designed to help you concentrate on one task at a time. When you activate Focus Mode, 
                the system "locks" your current priority list and presents tasks one-by-one in that order. 
                For each task, you can either complete it or skip it (with a reason that affects its future priority score).
                <p className="mt-2">
                  The key principle is that once Focus Mode starts, the presentation order remains fixed for that session,
                  regardless of any priority score changes that happen when you skip tasks.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card shadow-sm">
              <AccordionTrigger className="text-xl font-semibold py-4">
                Can I change the expiry date for tasks?
              </AccordionTrigger>
              <AccordionContent className="text-milk-600 pb-4">
                Yes, while tasks default to a 30-day expiry period, you can customize this setting for individual tasks based on their urgency and importance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6 bg-card shadow-sm">
              <AccordionTrigger className="text-xl font-semibold py-4">
                How do I break down large tasks into smaller ones?
              </AccordionTrigger>
              <AccordionContent className="text-milk-600 pb-4">
                When viewing a task, you can select the "Split Task" option to break it down into smaller sub-tasks. 
                These sub-tasks inherit properties from the parent task but can be managed independently. 
                This feature is particularly useful for large, complex tasks that might be overwhelming or difficult to complete in one go.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6 bg-card shadow-sm">
              <AccordionTrigger className="text-xl font-semibold py-4">
                What happens when a task expires?
              </AccordionTrigger>
              <AccordionContent className="text-milk-600 pb-4">
                When a task reaches its expiry date, it's marked as "expired" but isn't automatically deleted. 
                You can still complete it, reschedule it, or break it down into smaller sub-tasks. 
                The expiry system is designed to motivate completion before the deadline, rather than to remove tasks automatically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6 bg-card shadow-sm">
              <AccordionTrigger className="text-xl font-semibold py-4">
                Is there a limit to how many tasks I can create?
              </AccordionTrigger>
              <AccordionContent className="text-milk-600 pb-4">
                No, there is no limit to the number of tasks you can create in SourList. 
                However, we encourage focusing on a manageable number of tasks at a time to avoid feeling overwhelmed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6 bg-card shadow-sm">
              <AccordionTrigger className="text-xl font-semibold py-4">
                Does SourList work offline?
              </AccordionTrigger>
              <AccordionContent className="text-milk-600 pb-4">
                Yes, SourList is designed as a Progressive Web App (PWA) that can work offline. 
                Your tasks are synchronized when you're back online, ensuring you never lose your task data.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-fresh-bg to-fresh-accent/20 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-header">Still have questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Reach out to our support team and we'll get back to you as soon as possible.</p>
          <Link to="/contact">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-6 rounded-lg">
              Contact Support
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

export default FAQ;
