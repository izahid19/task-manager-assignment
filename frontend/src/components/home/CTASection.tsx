import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of teams already using TaskFlow to stay organized and productive.
        </p>
        <Link to="/auth/register">
          <Button size="lg" className="gap-2">
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
