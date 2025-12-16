import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage, type PaginatedResponse } from '@/lib/api';
import type { Task, TaskFormData, TaskFilters } from '@/types';

/** Query keys for task-related queries */
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  assigned: (filters?: TaskFilters) => [...taskKeys.all, 'assigned', filters] as const,
  created: (filters?: TaskFilters) => [...taskKeys.all, 'created', filters] as const,
  overdue: (filters?: TaskFilters) => [...taskKeys.all, 'overdue', filters] as const,
};

/** Fetch all tasks with filters */
export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
      if (filters.status) params.set('status', filters.status);
      if (filters.priority) params.set('priority', filters.priority);
      
      const response = await api.get<PaginatedResponse<Task>>(`/tasks?${params.toString()}`);
      return response.data;
    },
  });
}

/** Fetch a single task by ID */
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/tasks/${id}`);
      return response.data.data as Task;
    },
    enabled: !!id,
  });
}

/** Fetch tasks assigned to current user */
export function useAssignedTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskKeys.assigned(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
      
      const response = await api.get<PaginatedResponse<Task>>(`/tasks/dashboard/assigned?${params.toString()}`);
      return response.data;
    },
  });
}

/** Fetch tasks created by current user */
export function useCreatedTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskKeys.created(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
      
      const response = await api.get<PaginatedResponse<Task>>(`/tasks/dashboard/created?${params.toString()}`);
      return response.data;
    },
  });
}

/** Fetch overdue tasks */
export function useOverdueTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskKeys.overdue(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      
      const response = await api.get<PaginatedResponse<Task>>(`/tasks/dashboard/overdue?${params.toString()}`);
      return response.data;
    },
  });
}

/** Create a new task */
export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TaskFormData) => {
      const response = await api.post('/tasks', data);
      return response.data.data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

/** Update a task */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TaskFormData> }) => {
      const response = await api.patch(`/tasks/${id}`, data);
      return response.data.data as Task;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(task._id), task);
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

/** Delete a task */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}
