import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import gsap from 'gsap';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      navigate('/auth/reset-password', { state: { email: data.email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card ref={cardRef} className="shadow-lg opacity-0">
      <CardHeader>
        <Link to="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </Link>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>Enter your email and we'll send you a reset code</CardDescription>
      </CardHeader>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="form-element p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          <div className="form-element space-y-2">
            <Label htmlFor="email" required>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-9"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="form-element w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send reset code'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

