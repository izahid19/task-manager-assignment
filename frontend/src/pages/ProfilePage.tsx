import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks';
import { api, getErrorMessage } from '@/lib/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
} from '@/components/ui';
import gsap from 'gsap';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      // Card animation
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: 0.2, ease: 'back.out(1.4)' }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.patch('/users/profile', data);
      return response.data;
    },
    onSuccess: async () => {
      setSuccess(true);
      setError(null);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      setError(getErrorMessage(err));
      setSuccess(false);
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  return (
    <div ref={containerRef} className="max-w-2xl">
      <div ref={headerRef} className="mb-8 opacity-0">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card ref={cardRef} className="opacity-0">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-md bg-green-500/10 text-green-600 text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Profile updated successfully!
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" required>Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Account Status</h3>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${user?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm">
                  {user?.isVerified ? 'Email verified' : 'Email not verified'}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={updateProfile.isPending || !isDirty}
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

