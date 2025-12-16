import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Bell, Zap, ListTodo, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { forwardRef } from 'react';

export const HeroSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="hero-title inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Zap className="h-4 w-4" />
              Now with AI-powered task suggestions
            </div>
            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Work Smarter.
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Achieve More.
              </span>
            </h1>
            <p className="hero-subtitle mt-8 text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              The next-generation task management platform that transforms how teams collaborate, prioritize, and deliver.
            </p>
            <div className="hero-buttons mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl border-2">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="hero-buttons mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Setup in 2 min</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Enhanced Dashboard Preview */}
          <div className="hero-visual relative hidden lg:block">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
            
            {/* Main Card */}
            <div className="relative bg-card border rounded-2xl shadow-2xl p-6 transform hover:scale-[1.02] transition-transform duration-500">
              {/* Window Controls & Team Avatars */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs text-muted-foreground">TaskFlow Dashboard</span>
                </div>
                {/* Team Avatars */}
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border-2 border-card flex items-center justify-center text-[10px] text-white font-bold">A</div>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-card flex items-center justify-center text-[10px] text-white font-bold">J</div>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-card flex items-center justify-center text-[10px] text-white font-bold">M</div>
                    <div className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground font-medium">+5</div>
                  </div>
                  <div className="ml-2 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground">3 online</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Row with Progress Ring */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {/* Animated Progress Ring */}
                <div className="bg-muted rounded-xl p-3 flex items-center justify-center">
                  <div className="relative h-12 w-12">
                    <svg className="h-12 w-12 -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted-foreground/20" />
                      <circle 
                        cx="24" cy="24" r="20" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        fill="none" 
                        strokeDasharray="125.6" 
                        strokeDashoffset="31.4"
                        strokeLinecap="round"
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">75%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-primary">12</div>
                  <div className="text-[10px] text-muted-foreground">Active</div>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-green-500">28</div>
                  <div className="text-[10px] text-muted-foreground">Done</div>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-orange-500">3</div>
                  <div className="text-[10px] text-muted-foreground">Urgent</div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="flex-1 font-medium">Design system review</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 font-medium">Completed</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="flex-1 font-medium">API integration</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">In Progress</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="flex-1 font-medium">User testing phase</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 font-medium">Review</span>
                </div>
              </div>
            </div>

            {/* Floating Card 1 - Task Completed (Top Right) */}
            <div 
              className="absolute -right-6 top-8 bg-card border rounded-xl shadow-xl p-3 flex items-center gap-3"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center">
                <Bell className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <div className="text-xs font-medium">Task Completed!</div>
                <div className="text-[10px] text-muted-foreground">Design review done</div>
              </div>
            </div>

            {/* Floating Card 2 - New Task (Left Side) */}
            <div 
              className="absolute -left-10 top-1/3 bg-card border rounded-xl shadow-xl p-3 flex items-center gap-3"
              style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}
            >
              <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ListTodo className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-xs font-medium">New Task Assigned</div>
                <div className="text-[10px] text-muted-foreground">From Sarah</div>
              </div>
            </div>

            {/* Floating Card 3 - Deadline Timer (Bottom) */}
            <div 
              className="absolute -right-4 bottom-8 bg-card border rounded-xl shadow-xl p-3"
              style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-[10px] text-muted-foreground">Deadline</div>
                  <div className="text-sm font-bold text-orange-500">2h 34m</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-xs">Scroll to explore</span>
        <ArrowRight className="h-4 w-4 rotate-90" />
      </div>

      {/* Float Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
