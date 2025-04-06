
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SettingsHeaderProps {
  title: string;
  subtitle?: string;
}

export function SettingsHeader({ title, subtitle }: SettingsHeaderProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
  }, []);

  const handleBackClick = () => {
    if (isLoggedIn) {
      navigate('/app'); // Navigate to app page if logged in
    } else {
      navigate('/'); // Navigate to landing page if not logged in
    }
  };

  return (
    <header className="mb-8 relative">
      <div className="absolute left-0 top-0">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-milk-100 px-3 py-1 text-sm text-milk-800 mb-4">
          App Settings
        </div>
        <h1 className="text-4xl font-bold text-milk-900 mb-2">{title}</h1>
        {subtitle && <p className="text-milk-600">{subtitle}</p>}
      </div>
    </header>
  );
}
