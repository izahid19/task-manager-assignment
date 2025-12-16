import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useCreateTask, useUpdateTask, useUsers } from '@/hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import DatePicker from 'react-datepicker';
import type { Task, TaskFormData, TaskPriority, TaskStatus } from '@/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']).optional(),
  assignedToId: z.string().optional(),
});

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskFormDialog({ open, onOpenChange, task }: TaskFormDialogProps) {
  const { data: users } = useUsers();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate).toISOString().slice(0, 16),
          priority: task.priority,
          status: task.status,
          assignedToId: typeof task.assignedToId === 'object' ? task.assignedToId?.id : task.assignedToId,
        }
      : {
          priority: 'Medium' as TaskPriority,
          status: 'To Do' as TaskStatus,
        },
  });

  useEffect(() => {
    if (open) {
      if (task) {
        reset({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : '',
          priority: task.priority,
          status: task.status,
          assignedToId: typeof task.assignedToId === 'object' ? task.assignedToId?.id : task.assignedToId,
        });
      } else {
        reset({
          title: '',
          description: '',
          dueDate: '',
          priority: 'Medium',
          status: 'To Do',
          assignedToId: undefined,
        });
      }
    }
  }, [open, task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setError(null);
    try {
      if (isEditing && task) {
        await updateTask.mutateAsync({ id: task._id, data });
      } else {
        await createTask.mutateAsync(data);
      }
      reset();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onOpenChange(false);
  };

  const isLoading = createTask.isPending || updateTask.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the task details below.' : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title" required>Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                error={errors.title?.message}
                {...register('title')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" required>Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="dueDate" required>Due Date</Label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                      showTimeSelect
                      timeFormat="p"
                      timeIntervals={15}
                      dateFormat="Pp"
                      placeholderText="Pick a date & time"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      wrapperClassName="w-full"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label required>Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger error={errors.priority?.message}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {isEditing && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Do">To Do</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Controller
                  name="assignedToId"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value || 'unassigned'} 
                      onValueChange={(val) => field.onChange(val === 'unassigned' ? null : val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
