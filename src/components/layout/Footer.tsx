
import React from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/AppLogo';

export const Footer = () => {
  return (
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
                <li className="mb-1"><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
