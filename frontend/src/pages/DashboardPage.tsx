import { useEffect, useRef } from 'react';
import { ListTodo, ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAssignedTasks, useCreatedTasks, useOverdueTasks } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle, Badge, Skeleton } from '@/components/ui';
import { TaskCard } from '@/components/tasks';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';
import gsap from 'gsap';

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.ElementType;
  iconClass?: string;
  isLoading?: boolean;
}

function StatCard({ title, value, icon: Icon, iconClass, isLoading }: StatCardProps) {
  return (
    <Card className="stat-card hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', iconClass)} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold stat-value">{value ?? 0}</div>
        )}
      </CardContent>
    </Card>
  );
}

interface TaskSectionProps {
  title: string;
  tasks: Task[] | undefined;
  isLoading: boolean;
  emptyMessage: string;
  badge?: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' };
}

function TaskSection({ title, tasks, isLoading, emptyMessage, badge }: TaskSectionProps) {
  return (
    <div className="task-section space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.slice(0, 3).map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => {}}
              onDelete={() => {}}
              showActions={false}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {emptyMessage}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function DashboardPage() {
  const { data: assignedData, isLoading: assignedLoading } = useAssignedTasks({ limit: 5 });
  const { data: createdData, isLoading: createdLoading } = useCreatedTasks({ limit: 5 });
  const { data: overdueData, isLoading: overdueLoading } = useOverdueTasks({ limit: 5 });

  const totalAssigned = assignedData?.pagination?.total;
  const totalCreated = createdData?.pagination?.total;
  const totalOverdue = overdueData?.pagination?.total;
  const completedTasks = assignedData?.data?.filter((t) => t.status === 'Completed').length || 0;

  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      // Stat cards stagger animation
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(statCards,
          { opacity: 0, y: 40, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'back.out(1.7)' }
        );
      }

      // Task sections stagger animation
      if (containerRef.current) {
        const taskSections = containerRef.current.querySelectorAll('.task-section');
        gsap.fromTo(taskSections,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, delay: 0.5, ease: 'power2.out' }
        );
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div ref={headerRef} className="opacity-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your task overview.</p>
      </div>

      {/* Stats Grid */}
      <div ref={statsRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Assigned to Me"
          value={totalAssigned}
          icon={ListTodo}
          iconClass="text-blue-500"
          isLoading={assignedLoading}
        />
        <StatCard
          title="Created by Me"
          value={totalCreated}
          icon={ClipboardList}
          iconClass="text-green-500"
          isLoading={createdLoading}
        />
        <StatCard
          title="Overdue Tasks"
          value={totalOverdue}
          icon={AlertTriangle}
          iconClass="text-red-500"
          isLoading={overdueLoading}
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle}
          iconClass="text-emerald-500"
          isLoading={assignedLoading}
        />
      </div>

      {/* Tasks Sections */}
      <div className="grid gap-8 lg:grid-cols-2">
        <TaskSection
          title="Assigned to Me"
          tasks={assignedData?.data}
          isLoading={assignedLoading}
          emptyMessage="No tasks assigned to you"
        />
        <TaskSection
          title="Overdue Tasks"
          tasks={overdueData?.data}
          isLoading={overdueLoading}
          emptyMessage="No overdue tasks"
          badge={totalOverdue ? { label: `${totalOverdue}`, variant: 'destructive' } : undefined}
        />
      </div>

      <TaskSection
        title="Created by Me"
        tasks={createdData?.data}
        isLoading={createdLoading}
        emptyMessage="You haven't created any tasks yet"
      />
    </div>
  );
}

