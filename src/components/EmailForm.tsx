
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailFormProps {
  onSubmit: (email: string) => void;
  userName: { firstName: string; lastName: string };
  answers: Record<string, any>;
  results: {
    overallScore: number;
    vitality: 'Low' | 'Moderate' | 'Good' | 'Excellent';
    categoryScores: {
      sleep: number;
      diet: number;
      exercise: number;
      stress: number;
      health: number;
    };
    recommendations: {
      supplements: boolean;
      ketogenic: boolean;
      paleo: boolean;
      specificSupplements: string[];
    };
  };
}

const EmailForm = ({ onSubmit, userName, answers, results }: EmailFormProps) => {
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
      // Call the edge function to send the email
      const { data, error } = await supabase.functions.invoke('send-longevity-report', {
        body: {
          firstName: userName.firstName,
          lastName: userName.lastName,
          email: email.trim(),
          answers,
          results,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Report Sent!",
          description: "Your longevity report has been sent to your email address.",
        });
        onSubmit(email.trim());
      } else {
        throw new Error(data?.error || 'Failed to send report');
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      setError('Failed to send the report. Please try again.');
      toast({
        title: "Error",
        description: "Failed to send your report. Please try again.",
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
            Enter your email address to receive your personalized longevity report and recommendations.
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
              {isLoading ? 'Sending Report...' : 'Get My Longevity Report'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Your email will only be used to send you your results.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailForm;
