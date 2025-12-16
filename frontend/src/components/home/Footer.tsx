import { ListTodo } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <ListTodo className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">TaskFlow</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2024 TaskFlow. Built with ❤️
        </p>
      </div>
    </footer>
  );
}
