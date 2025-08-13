import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackLead, trackCompleteRegistration } from '@/utils/pixel';

interface EmailCollectionFormProps {
  userName: { firstName: string; lastName: string };
  answers: Record<string, any>;
  results: any;
  onEmailSubmitted: () => void;
}

const EmailCollectionForm = ({ userName, answers, results, onEmailSubmitted }: EmailCollectionFormProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive your report.",
        variant: "destructive"
      });
      return;
    }

    // Meta Pixel: fire events on form submit
    trackLead({ email });
    trackCompleteRegistration({ email });

    setIsSubmitting(true);

    try {
      // Save quiz response to database
      const { error: saveError } = await supabase
        .from('quiz_responses')
        .insert({
          first_name: userName.firstName,
          last_name: userName.lastName,
          email: email,
          answers: answers,
          overall_score: results.overallScore,
          category_scores: results.categoryScores,
          recommendations: results.recommendations,
          vitality: results.vitality
        });

      if (saveError) throw saveError;

      // Send emails
      const { error: emailError } = await supabase.functions.invoke('send-longevity-report', {
        body: {
          userEmail: email,
          userName: userName,
          answers: answers,
          results: results
        }
      });

      if (emailError) throw emailError;

      // Subscribe to mailing list
      const { error: subscribeError } = await supabase.functions.invoke('subscribe-to-mailing-list', {
        body: {
          name: `${userName.firstName} ${userName.lastName}`,
          email: email
        }
      });

      if (subscribeError) {
        console.error('Subscription error:', subscribeError);
        // Don't throw - this shouldn't block the main flow
      }


      toast({
        title: "Success!",
        description: "Your personalized longevity report has been sent to your email."
      });

      onEmailSubmitted();
    } catch (error) {
      console.error('Error submitting email:', error);
      toast({
        title: "Error",
        description: "There was an issue sending your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Get Your Personalized Report</CardTitle>
            <CardDescription>
              Enter your email to receive your comprehensive longevity assessment and personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Your Report...
                  </>
                ) : (
                  'Send My Longevity Report'
                )}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Your email will be used to send your personalized report and occasional health tips. 
                You can unsubscribe at any time.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailCollectionForm;