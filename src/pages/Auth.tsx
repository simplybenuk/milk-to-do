
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

type View = 'sign-in' | 'sign-up';

export default function Auth() {
  const [view, setView] = useState<View>('sign-in');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/app');
      }
    });
  }, [navigate]);
  
  return (
    <AuthContainer
      title={view === 'sign-in' ? 'Sign In' : 'Sign Up'}
      description={view === 'sign-in' ? 'Sign in to your account' : 'Create an account'}
      footer={
        <div className="text-sm">
          {view === 'sign-in' ? (
            <>
              Don't have an account?{' '}
              <Button variant="link" onClick={() => setView('sign-up')} className="p-0 h-auto">
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button variant="link" onClick={() => setView('sign-in')} className="p-0 h-auto">
                Sign in
              </Button>
            </>
          )}
        </div>
      }
    >
      {view === 'sign-in' ? <SignInForm /> : <SignUpForm />}
    </AuthContainer>
  );
}
