import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationFormProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerificationForm = ({ email, onVerified, onBack }: OTPVerificationFormProps) => {
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const { toast } = useToast();

  // Start countdown timer
  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          email,
          otpCode,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.verified) {
        toast({
          title: "Email Verified!",
          description: "Your email has been successfully verified.",
        });
        onVerified();
      } else {
        throw new Error(data?.error || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Failed to verify code. Please try again.');
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email },
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
        setTimeLeft(300); // Reset timer
        setOtpCode(''); // Clear current code
      } else {
        throw new Error(data?.error || 'Failed to resend code');
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      setError('Failed to resend code. Please try again.');
      toast({
        title: "Resend Failed",
        description: "Failed to send new verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
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
            Verify Your Email
          </CardTitle>
          <p className="text-gray-600 mt-2">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-blue-600 font-medium">{email}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={(value) => {
                  setOtpCode(value);
                  setError('');
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code expired'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || otpCode.length !== 6 || timeLeft === 0}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={isVerifying || isResending}
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
                className="flex-1"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Sending...' : 'Resend'}
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Didn't receive the code? Check your spam folder or try resending.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerificationForm;