
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/AppLogo';

type AuthContainerProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthContainer({ title, description, children, footer }: AuthContainerProps) {
  return (
    <div className="grid h-screen place-items-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl text-center">
            <AppLogo size="medium" />
          </CardTitle>
          <CardDescription className="text-center text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          {footer}
        </CardFooter>
      </Card>
    </div>
  );
}
