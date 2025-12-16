import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import gsap from 'gsap';

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {

  const location = useLocation();
  const { resetPassword } = useAuth();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // GSAP refs
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
      
      if (formRef.current) {
        const formElements = formRef.current.querySelectorAll('.form-element');
        gsap.fromTo(formElements,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
        );
      }
    });
    
    return () => ctx.revert();
  }, [email, success]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleOtpChange = (index: number, value: string) => {
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await resetPassword(email, otpValue, data.newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground mb-4">
            Invalid access. Please request a password reset first.
          </p>
          <Button asChild className="w-full">
            <Link to="/auth/forgot-password">Request reset</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card ref={cardRef} className="shadow-lg opacity-0">
        <CardHeader>
          <CardTitle className="text-center">Password reset successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to="/auth/login">Sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="shadow-lg opacity-0">
      <CardHeader>
        <Link to="/auth/forgot-password" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter the code sent to <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="form-element p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          <div className="form-element space-y-2">
            <Label required>Reset Code</Label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-10 text-center text-lg font-semibold"
                />
              ))}
            </div>
          </div>
          <div className="form-element space-y-2">
            <Label htmlFor="newPassword" required>New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
            </div>
          </div>
          <div className="form-element space-y-2">
            <Label htmlFor="confirmPassword" required>Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="form-element w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

