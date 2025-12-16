import { format } from 'date-fns';
import { Calendar, User, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { cn, isOverdue } from '@/lib/utils';
import type { Task, TaskPriority, TaskStatus, User as UserType } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  showActions?: boolean;
}

const priorityVariants: Record<TaskPriority, 'low' | 'medium' | 'high' | 'urgent'> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Urgent: 'urgent',
};

const statusColors: Record<TaskStatus, string> = {
  'To Do': 'bg-gray-500',
  'In Progress': 'bg-blue-500',
  Review: 'bg-yellow-500',
  Completed: 'bg-green-500',
};

export function TaskCard({ task, onEdit, onDelete, showActions = true }: TaskCardProps) {
  const assignee = typeof task.assignedToId === 'object' ? task.assignedToId : null;
  const creator = typeof task.creatorId === 'object' ? task.creatorId : null;
  const dueDate = new Date(task.dueDate);
  const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-md', overdue && 'border-destructive/50')}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('w-2 h-2 rounded-full', statusColors[task.status])} />
              <h3 className="font-semibold text-lg truncate">{task.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {task.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={priorityVariants[task.priority]}>{task.priority}</Badge>
              <Badge variant="outline">{task.status}</Badge>
              {overdue && <Badge variant="destructive">Overdue</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className={cn('flex items-center gap-1', overdue && 'text-destructive')}>
                <Calendar className="h-4 w-4" />
                {format(dueDate, 'MMM d, yyyy h:mm a')}
              </div>
              {assignee && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {(assignee as UserType).name}
                </div>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(task._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
