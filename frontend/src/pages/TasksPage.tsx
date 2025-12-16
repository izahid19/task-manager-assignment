import { useState, useEffect, useRef } from 'react';
import { Plus, Filter, ArrowUpDown, ListTodo } from 'lucide-react';
import { useTasks, useDeleteTask } from '@/hooks';
import { TaskCard, TaskCardSkeleton, TaskFormDialog } from '@/components/tasks';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui';
import type { Task, TaskFilters } from '@/types';
import gsap from 'gsap';

export function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10 });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data, isLoading } = useTasks(filters);
  const deleteTask = useDeleteTask();

  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      // Filters animation
      gsap.fromTo(filtersRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  // Animate task cards when data changes
  useEffect(() => {
    if (!isLoading && data?.data && taskListRef.current) {
      const taskCards = taskListRef.current.querySelectorAll('.task-card-animated');
      gsap.fromTo(taskCards,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [data, isLoading]);

  const handleFilterChange = (key: keyof TaskFilters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleDelete = (taskId: string) => {
    setDeleteConfirm(taskId);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteTask.mutateAsync(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleFormClose = (open: boolean) => {
    if (!open) {
      setEditingTask(null);
    }
    setFormOpen(open);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-0">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage and track all your tasks</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div ref={filtersRef} className="flex flex-wrap gap-3 items-center p-4 bg-card rounded-lg border opacity-0">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filters.status || 'all'} onValueChange={(val) => handleFilterChange('status', val)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.priority || 'all'} onValueChange={(val) => handleFilterChange('priority', val)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={filters.sortBy || 'createdAt'} onValueChange={(val) => handleFilterChange('sortBy', val)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.sortOrder || 'desc'} onValueChange={(val) => handleFilterChange('sortOrder', val)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <div ref={taskListRef} className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <TaskCardSkeleton key={i} />)
        ) : data?.data && data.data.length > 0 ? (
          data.data.map((task) => (
            <div key={task._id} className="task-card-animated">
              <TaskCard
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Create your first task to get started</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!data.pagination.hasPrevPage}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.pagination.hasNextPage}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        task={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteTask.isPending}>
              {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
