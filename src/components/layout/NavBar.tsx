
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';

export const NavBar = () => {
  return (
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
  );
};
