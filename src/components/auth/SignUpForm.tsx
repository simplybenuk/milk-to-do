
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [allowTracking, setAllowTracking] = useState(true);
  const [allowMarketing, setAllowMarketing] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
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
  
      console.log('Attempting to sign up with email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/app',
          data: {
            allow_tracking: allowTracking,
            allow_marketing: allowMarketing,
          },
        },
      });
  
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful, data:', data);
      toast.success('Account created successfully! Please check your email for verification.');
      navigate('/email-confirmation');
    } catch (error: any) {
      console.error('Full error object:', error);
      const errorMessage = error.message || error.error_description || 'Authentication failed';
      setError(errorMessage);
      toast.error(`Signup failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-5">
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
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="allow-tracking" 
            checked={allowTracking}
            onCheckedChange={(checked) => setAllowTracking(checked === true)}
            className="mt-1"
          />
          <Label htmlFor="allow-tracking" className="text-sm font-normal cursor-pointer">
            Help us improve SourList by allowing analytics. See our{' '}
            <Link to="/privacy" className="text-emerald-600 hover:underline">
              privacy policy
            </Link>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="allow-marketing" 
            checked={allowMarketing}
            onCheckedChange={(checked) => setAllowMarketing(checked === true)}
          />
          <Label htmlFor="allow-marketing" className="text-sm font-normal cursor-pointer">
            I'd like to receive marketing emails about product updates and offers
          </Label>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <Button disabled={loading} className="w-full h-11 mt-2">
        {loading ? 'Loading...' : 'Sign Up'}
      </Button>
    </form>
  );
}
