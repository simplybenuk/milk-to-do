
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
          setLoading(false);
          return;
        }
    
        if (!isValidPassword(password)) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
    
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
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
        // Redirect to email confirmation page instead of /app
        navigate('/email-confirmation');
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
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl text-center">
            <AppLogo size="medium" />
          </CardTitle>
          <CardDescription className="text-center text-base">
            {view === 'sign-in' ? 'Sign in to your account' : 'Create an account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            {view === 'sign-up' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button disabled={loading} className="w-full h-11 mt-2">
              {loading ? 'Loading...' : view === 'sign-in' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
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
        </CardFooter>
      </Card>
    </div>
  );
}
