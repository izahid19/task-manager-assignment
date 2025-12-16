import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks';
import { gsap } from 'gsap';
import { Navbar, HeroSection, FeaturesSection, CTASection, Footer } from '@/components/home';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.hero-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out',
      });

      gsap.from('.hero-visual', {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} />
      <HeroSection ref={heroRef} />
      <FeaturesSection ref={featuresRef} />
      <CTASection />
      <Footer />
    </div>
  );
}

