import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailFormProps {
  onEmailSubmitted: (email: string) => void;
  userName: { firstName: string; lastName: string };
}

const EmailForm = ({ onEmailSubmitted, userName }: EmailFormProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      // Send OTP to email
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: email.trim() },
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Verification Code Sent!",
          description: "Please check your email for the verification code.",
        });
        onEmailSubmitted(email.trim());
      } else {
        throw new Error(data?.error || 'Failed to send verification code');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setError('Failed to send verification code. Please try again.');
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Almost There, {userName.firstName}!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your email address to verify it and receive your personalized longevity report.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-1"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Sending Verification Code...' : 'Send Verification Code'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              We'll send you a verification code to confirm your email address.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailForm;