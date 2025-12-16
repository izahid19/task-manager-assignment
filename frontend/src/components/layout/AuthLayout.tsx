import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-muted-foreground mt-2">Collaborate and manage tasks efficiently</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
