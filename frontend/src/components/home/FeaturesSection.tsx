import { forwardRef } from 'react';
import { Shield, Zap, ListTodo, Bell, CheckCircle2, Users } from 'lucide-react';

export const FeaturesSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            Essential tools for your{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              productivity growth
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock your team's potential with TaskFlow's powerful suite of tools designed to drive your success.
          </p>
        </div>

        {/* Feature Cards Grid - 2x2 Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 - Real-time Task Insights */}
          <div className="feature-card group bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold mb-3">Real-time task insights</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Gain instant access to your task analytics. Make informed decisions with up-to-the-minute information.
            </p>
            {/* Visual - Animated Chart */}
            <div className="bg-muted rounded-xl p-6 relative overflow-hidden">
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              
              <div className="flex items-end justify-between relative">
                {/* Bars Container */}
                <div className="flex items-end gap-2">
                  {[
                    { height: 50, day: 'Mon', percent: 40 },
                    { height: 80, day: 'Tue', percent: 65 },
                    { height: 56, day: 'Wed', percent: 45 },
                    { height: 100, day: 'Thu', percent: 80 },
                    { height: 70, day: 'Fri', percent: 55 },
                    { height: 115, day: 'Sat', percent: 90 },
                    { height: 90, day: 'Sun', percent: 70 },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center relative group/bar">
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                        {bar.day}: {bar.percent}%
                      </div>
                      {/* Bar with grow animation */}
                      <div 
                        className="w-6 bg-primary rounded-t-sm cursor-pointer hover:bg-primary/80 transition-colors duration-200 animate-grow-bar"
                        style={{ 
                          height: `${bar.height}px`,
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                      {/* Day label */}
                      <div className="text-[9px] text-muted-foreground text-center mt-2">{bar.day.charAt(0)}</div>
                    </div>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="text-right ml-6">
                  <div className="text-3xl font-bold text-primary animate-count-up">87%</div>
                  <div className="text-xs text-muted-foreground">Completion Rate</div>
                  {/* Trend indicator */}
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <span className="text-green-500 text-sm font-medium animate-fade-in">↑ 12%</span>
                    <span className="text-[10px] text-muted-foreground">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Automated Task Tracking */}
          <div className="feature-card group bg-card border border-border rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold mb-3">Automated task tracking</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Categorize and monitor progress without lifting a finger with our automated system.
            </p>
            {/* Visual - Task Stats with Animations */}
            <div className="bg-muted rounded-xl p-6 space-y-4 relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              
              {/* Total Tasks Row */}
              <div className="flex justify-between items-center p-3 bg-background rounded-lg animate-slide-in-right" style={{ animationDelay: '0ms' }}>
                <span className="text-sm font-medium">Total Tasks</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-progress-bar" style={{ width: '100%' }} />
                  </div>
                  <span className="text-xl font-bold text-blue-500 animate-count-up">156</span>
                </div>
              </div>
              
              {/* Completed Row */}
              <div className="flex justify-between items-center p-3 bg-background rounded-lg animate-slide-in-right" style={{ animationDelay: '100ms' }}>
                <span className="text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Completed
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full animate-progress-bar" style={{ width: '57%', animationDelay: '200ms' }} />
                  </div>
                  <span className="text-xl font-bold text-green-500 animate-count-up" style={{ animationDelay: '100ms' }}>89</span>
                </div>
              </div>
              
              {/* In Progress Row */}
              <div className="flex justify-between items-center p-3 bg-background rounded-lg animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                <span className="text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '500ms' }} />
                  In Progress
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full animate-progress-bar" style={{ width: '43%', animationDelay: '400ms' }} />
                  </div>
                  <span className="text-xl font-bold text-orange-500 animate-count-up" style={{ animationDelay: '200ms' }}>67</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Secure Collaboration */}
          <div className="feature-card group bg-card border border-border rounded-2xl p-8 hover:border-green-500 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold mb-3">Secure collaboration</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Enjoy peace of mind with advanced security protocols. Your data is encrypted and protected against threats.
            </p>
            {/* Visual - Enhanced Security Dashboard */}
            <div className="bg-muted rounded-xl p-6 relative overflow-hidden">
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-20" />
              
              {/* Scan lines effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="h-px w-full bg-green-500/30 animate-scan-line" />
              </div>
              
              <div className="flex items-center gap-6">
                {/* Shield with animations */}
                <div className="relative">
                  {/* Rotating outer ring */}
                  <div className="absolute -inset-3 rounded-full border-2 border-dashed border-green-500/30 animate-spin-slow" />
                  {/* Pulsing glow */}
                  <div className="absolute -inset-1 rounded-full bg-green-500/20 animate-pulse-glow" />
                  {/* Shield icon */}
                  <div className="relative h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500/40 group-hover:scale-110 transition-transform duration-300 z-10">
                    <Shield className="h-10 w-10 text-green-500" />
                    {/* Checkmark badge */}
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center animate-bounce-in">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Security Stats */}
                <div className="flex-1 space-y-3">
                  {/* Encryption Badge */}
                  <div className="flex items-center justify-between p-2 bg-background rounded-lg animate-slide-in-right">
                    <span className="text-xs text-muted-foreground">Encryption</span>
                    <span className="text-xs font-medium text-green-500 px-2 py-0.5 bg-green-500/10 rounded-full">AES-256</span>
                  </div>
                  {/* SSL Badge */}
                  <div className="flex items-center justify-between p-2 bg-background rounded-lg animate-slide-in-right" style={{ animationDelay: '100ms' }}>
                    <span className="text-xs text-muted-foreground">Connection</span>
                    <span className="text-xs font-medium text-green-500 px-2 py-0.5 bg-green-500/10 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      SSL/TLS
                    </span>
                  </div>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between p-2 bg-background rounded-lg animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                    <span className="text-xs text-muted-foreground">Status</span>
                    <span className="text-xs font-medium text-green-500">Protected ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Seamless Integration */}
          <div className="feature-card group bg-card border border-border rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold mb-3">Seamless integration</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Easily connect TaskFlow with your existing tools. Our seamless integration ensures smooth workflows.
            </p>
            {/* Visual - Enhanced Integration Flow */}
            <div className="bg-muted rounded-xl p-6 relative overflow-hidden">
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-20" />
              
              {/* Main integration flow */}
              <div className="flex items-center justify-center gap-3 relative mb-4">
                {/* Left Apps Stack */}
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <Zap className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center border border-border group-hover:scale-105 transition-transform duration-300 animate-fade-in-up ml-2" style={{ animationDelay: '100ms' }}>
                    <Bell className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                
                {/* Left Line with multiple flowing dots */}
                <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-2 w-2 bg-white rounded-full animate-flow-dot" />
                    <div className="h-1.5 w-1.5 bg-white/70 rounded-full animate-flow-dot" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                
                {/* Center - TaskFlow Hub */}
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-purple-500/20 animate-pulse-glow" />
                  <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
                    <ListTodo className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 rounded-full text-[8px] text-white font-medium animate-bounce-in whitespace-nowrap">
                    Synced
                  </div>
                </div>
                
                {/* Right Line with multiple flowing dots */}
                <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-primary rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-end">
                    <div className="h-2 w-2 bg-white rounded-full animate-flow-dot-reverse" />
                    <div className="h-1.5 w-1.5 bg-white/70 rounded-full animate-flow-dot-reverse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                
                {/* Right Apps Stack */}
                <div className="flex flex-col gap-2 items-end">
                  <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center border border-border group-hover:scale-105 transition-transform duration-300 animate-fade-in-up mr-2" style={{ animationDelay: '300ms' }}>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
              
              {/* Integration count */}
              <div className="flex justify-center">
                <div className="px-3 py-1 rounded-full bg-background border border-border text-xs text-muted-foreground animate-fade-in">
                  <span className="text-primary font-medium">12+</span> apps connected
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 - Smart Notifications */}
          <div className="feature-card group bg-card border border-border rounded-2xl p-8 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl md:col-span-2">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">Smart notifications</h3>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium animate-pulse">Live</span>
                  </div>
                  {/* Quick filters */}
                  <div className="hidden sm:flex items-center gap-2">
                    <button className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">All</button>
                    <button className="px-2 py-1 rounded-md text-muted-foreground text-xs hover:bg-muted transition-colors">Unread</button>
                    <button className="px-2 py-1 rounded-md text-muted-foreground text-xs hover:bg-muted transition-colors">Mentions</button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  Never miss a deadline with intelligent notifications. Get alerts when tasks are assigned, updated, or approaching due dates.
                </p>
                
                {/* Notification List with animations */}
                <div className="space-y-3 relative">
                  {/* Notification 1 - New with shimmer and action buttons */}
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl animate-slide-in-right relative overflow-hidden group/notif" style={{ animationDelay: '0ms' }}>
                    {/* Unread indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-l-xl" />
                    {/* Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    <div className="relative ml-2">
                      <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-yellow-500 animate-bell-shake" />
                      </div>
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-bounce-in">!</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium truncate">New task assigned to you</div>
                        <span className="px-1.5 py-0.5 rounded-full bg-yellow-500 text-[9px] text-white font-bold animate-pulse shrink-0">NEW</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          just now
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>From: Sarah Chen</span>
                      </div>
                    </div>
                    {/* Action buttons - show on hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover/notif:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/80 transition-colors">View</button>
                      <button className="p-1.5 rounded-md bg-muted-foreground/10 text-muted-foreground text-xs hover:bg-muted-foreground/20 transition-colors">✕</button>
                    </div>
                  </div>
                  
                  {/* Notification 2 - Completed with progress ring animation */}
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl animate-slide-in-right group/notif" style={{ animationDelay: '100ms' }}>
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      {/* Completion ring */}
                      <svg className="absolute -inset-1 w-12 h-12" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/20" />
                        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 animate-draw-circle" strokeDasharray="125.6" strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 24 24)" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">Task "API Review" completed</div>
                      <div className="text-xs text-muted-foreground">15m ago • By: Mike Johnson</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-xs font-medium bg-green-500/10 px-2 py-0.5 rounded-full">✓ Done</span>
                    </div>
                  </div>
                  
                  {/* Notification 3 - Mention with avatar and typing */}
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl animate-slide-in-right group/notif" style={{ animationDelay: '200ms' }}>
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        JD
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">@John Doe mentioned you</div>
                      <div className="text-xs text-muted-foreground">"Can you check the design specs for..."</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        1h ago
                        <span className="flex items-center gap-1 text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
                          <span className="flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                          replying
                        </span>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-md bg-blue-500 text-white text-xs hover:bg-blue-600 transition-colors opacity-0 group-hover/notif:opacity-100">Reply</button>
                  </div>
                  
                  {/* Notification 4 - Deadline warning with countdown */}
                  <div className="flex items-center gap-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl animate-slide-in-right relative overflow-hidden" style={{ animationDelay: '300ms' }}>
                    {/* Urgent pulse background */}
                    <div className="absolute inset-0 bg-orange-500/5 animate-pulse-glow pointer-events-none" />
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-orange-500 animate-pulse" />
                      </div>
                      {/* Warning ripple */}
                      <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-ripple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-orange-500">⚠️ Deadline approaching</div>
                        <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-[9px] font-bold">URGENT</span>
                      </div>
                      <div className="text-xs text-muted-foreground">"Homepage redesign" due in 2 hours</div>
                      {/* Progress bar for time remaining */}
                      <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full animate-shrink-bar" style={{ width: '25%' }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-500 text-xl font-bold animate-pulse">2h</div>
                      <div className="text-[10px] text-muted-foreground">remaining</div>
                    </div>
                  </div>
                </div>
                
                {/* Mark all as read */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">4 unread notifications</span>
                  <button className="text-xs text-primary hover:underline">Mark all as read</button>
                </div>
              </div>
              
              {/* Right side - Enhanced Bell Hub */}
              <div className="hidden md:flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  {/* Sound wave ripples */}
                  <div className="absolute -inset-8 rounded-full border border-yellow-500/20 animate-ripple" />
                  <div className="absolute -inset-6 rounded-full border border-yellow-500/30 animate-ripple" style={{ animationDelay: '0.5s' }} />
                  {/* Outer pulse ring */}
                  <div className="absolute -inset-4 rounded-full border-2 border-dashed border-yellow-500/30 animate-spin-slow" />
                  {/* Pulsing glow */}
                  <div className="absolute -inset-2 rounded-full bg-yellow-500/20 animate-pulse-glow" />
                  {/* Main bell */}
                  <div className="relative h-28 w-28 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500/40 group-hover:scale-110 transition-transform duration-300 z-10">
                    <Bell className="h-14 w-14 text-yellow-500 animate-bell-shake" />
                  </div>
                  {/* Notification count badge */}
                  <div className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-sm text-white font-bold shadow-lg animate-bounce-in z-20">
                    4
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-yellow-500 animate-count-up">24</div>
                    <div className="text-[10px] text-muted-foreground">Today</div>
                  </div>
                  <div className="p-2 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-green-500 animate-count-up">89%</div>
                    <div className="text-[10px] text-muted-foreground">Read</div>
                  </div>
                </div>
                
                {/* Notification types legend */}
                <div className="flex flex-wrap justify-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Tasks</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Mentions</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Urgent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        .animate-grow-bar {
          animation: growBar 0.6s ease-out forwards;
          transform-origin: bottom;
        }
        @keyframes growBar {
          from { 
            transform: scaleY(0);
            opacity: 0;
          }
          to { 
            transform: scaleY(1);
            opacity: 1;
          }
        }
        
        .animate-count-up {
          animation: countUp 0.8s ease-out forwards;
        }
        @keyframes countUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
          opacity: 0;
          transform: translateX(-20px);
        }
        @keyframes slideInRight {
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-progress-bar {
          animation: progressBar 1s ease-out forwards;
          transform-origin: left;
          transform: scaleX(0);
        }
        @keyframes progressBar {
          to { transform: scaleX(1); }
        }
        
        /* Card 3 Animations */
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out forwards;
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        /* Card 4 Animations */
        .animate-flow-dot {
          animation: flowDot 1.5s ease-in-out infinite;
        }
        @keyframes flowDot {
          0% { transform: translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        .animate-flow-dot-reverse {
          animation: flowDotReverse 1.5s ease-in-out infinite;
          animation-delay: 0.75s;
        }
        @keyframes flowDotReverse {
          0% { transform: translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        
        .animate-pulse-subtle {
          animation: pulseSubtle 2s ease-in-out infinite;
        }
        @keyframes pulseSubtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        /* Card 3 Scan Line */
        .animate-scan-line {
          animation: scanLine 2s ease-in-out infinite;
        }
        @keyframes scanLine {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }
        
        /* Card 4 Fade In Up */
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(10px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Card 5 Bell Shake */
        .animate-bell-shake {
          animation: bellShake 2s ease-in-out infinite;
          transform-origin: top center;
        }
        @keyframes bellShake {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-15deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-10deg); }
          50% { transform: rotate(5deg); }
          60% { transform: rotate(-5deg); }
          70% { transform: rotate(0deg); }
        }
        
        /* Card 5 Additional Animations */
        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animate-draw-circle {
          animation: drawCircle 1s ease-out forwards;
        }
        @keyframes drawCircle {
          from { stroke-dashoffset: 125.6; }
          to { stroke-dashoffset: 0; }
        }
        
        .animate-shrink-bar {
          animation: shrinkBar 3s linear infinite;
        }
        @keyframes shrinkBar {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';
