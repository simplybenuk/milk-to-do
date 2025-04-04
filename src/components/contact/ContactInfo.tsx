
import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export const ContactInfo = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <Mail className="h-6 w-6 text-emerald-500 mr-4 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Email</h3>
            <p className="text-milk-600">Contact us using the form</p>
            <p className="text-milk-500 text-sm mt-1">We aim to respond within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};
