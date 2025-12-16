import { Link } from 'react-router-dom';
import { ListTodo, LayoutDashboard, User } from 'lucide-react';
import { Button } from '@/components/ui';

interface NavbarProps {
  isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <ListTodo className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">TaskFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/app/dashboard">
                  <Button variant="ghost" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/app/profile">
                  <Button size="icon" variant="ghost">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
