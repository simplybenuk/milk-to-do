
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/AppLogo';
import { MailCheck } from 'lucide-react';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid h-screen place-items-center bg-milk-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl text-center">
            <AppLogo size="medium" />
          </CardTitle>
          <div className="flex justify-center my-4">
            <MailCheck size={48} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription className="text-center text-base">
            We've sent you a confirmation email. Please check your inbox and follow the instructions to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The email might take a few minutes to arrive. If you don't see it, please check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button 
            variant="link" 
            onClick={() => navigate('/auth')}
            className="text-sm"
          >
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
