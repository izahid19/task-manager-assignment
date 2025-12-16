import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import gsap from 'gsap';

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // GSAP refs
  const cardRef = useRef<HTMLDivElement>(null);
  const otpContainerRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
      
      // OTP boxes stagger animation
      if (otpContainerRef.current) {
        const otpInputs = otpContainerRef.current.querySelectorAll('input');
        gsap.fromTo(otpInputs,
          { opacity: 0, scale: 0.5, rotateY: 90 },
          { opacity: 1, scale: 1, rotateY: 0, duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'back.out(1.7)' }
        );
      }
    });
    
    return () => ctx.revert();
  }, [email]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await verifyOtp(email, otpValue);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setResendMessage(null);
    setIsResending(true);
    try {
      await resendOtp(email);
      setResendMessage('OTP sent successfully! Check your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground mb-4">
            Invalid access. Please register first.
          </p>
          <Button asChild className="w-full">
            <Link to="/auth/register">Go to Register</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="shadow-lg opacity-0">
      <CardHeader>
        <Link to="/auth/register" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          {resendMessage && (
            <div className="p-3 rounded-md bg-green-500/10 text-green-600 text-sm">
              {resendMessage}
            </div>
          )}
          <div ref={otpContainerRef} className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold"
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

