
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/AppLogo';

type View = 'sign-in' | 'sign-up';

export default function Auth() {
  const [view, setView] = useState<View>('sign-in');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/app');
      }
    });
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (view === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        navigate('/app');
      } else {
        if (!isValidEmail(email)) {
          setError('Please enter a valid email address.');
          return;
        }
    
        if (!isValidPassword(password)) {
          setError('Password must be at least 6 characters long.');
          return;
        }
    
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
    
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/app',
          },
        });
    
        if (error) throw error;
        navigate('/app');
      }
    } catch (error: any) {
      setError(error.message || error.error_description || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grid h-screen place-items-center bg-milk-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            <AppLogo size="medium" />
          </CardTitle>
          <CardDescription className="text-center">
            {view === 'sign-in' ? 'Sign in to your account' : 'Create an account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {view === 'sign-up' && (
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button disabled={loading} className="w-full mt-4">
              {loading ? 'Loading...' : view === 'sign-in' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {view === 'sign-in' ? (
            <>
              Don't have an account?{' '}
              <Button variant="link" onClick={() => setView('sign-up')}>
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button variant="link" onClick={() => setView('sign-in')}>
                Sign in
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
