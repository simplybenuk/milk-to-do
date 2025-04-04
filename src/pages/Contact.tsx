
import React from 'react';
import { ContactForm, ContactInfo } from '@/components/contact';
import { NavBar, Footer } from '@/components/layout';

const Contact = () => {
  return (
    <div className="min-h-screen bg-fresh-bg flex flex-col">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <section className="py-16 bg-milk-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-header">Contact Us</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-milk-600">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Information */}
            <ContactInfo />
            
            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
