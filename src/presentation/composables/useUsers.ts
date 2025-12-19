import { computed, ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { CreateUserDTO, UpdateUserDTO } from '@/application/dtos';
import { UserService, type UserFilters } from '@/infrastructure/services/UserService';
import { httpClient } from '@/infrastructure/api/httpClient';
import { useNotification } from './useNotification';

const userService = new UserService(httpClient);

/**
 * Query keys for users
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Composable for fetching users list with pagination
 */
export function useUsersList(initialFilters?: UserFilters) {
  const filters = ref<UserFilters>(initialFilters ?? { page: 1, perPage: 15 });

  const query = useQuery({
    queryKey: computed(() => userKeys.list(filters.value)),
    queryFn: async () => {
      const result = await userService.list(filters.value);
      if (result.isFailure) {
        throw new Error(result.error);
      }
      return result.getValue();
    },
  });

  const users = computed(() => query.data.value?.data ?? []);
  const meta = computed(() => query.data.value?.meta);
  const totalPages = computed(() => meta.value?.last_page ?? 1);
  const currentPage = computed(() => meta.value?.current_page ?? 1);
  const total = computed(() => meta.value?.total ?? 0);

  function setPage(page: number): void {
    filters.value = { ...filters.value, page };
  }

  function setFilters(newFilters: Partial<UserFilters>): void {
    filters.value = { ...filters.value, ...newFilters, page: 1 };
  }

  function setSearch(search: string): void {
    filters.value = { ...filters.value, search, page: 1 };
  }

  return {
    users,
    meta,
    totalPages,
    currentPage,
    total,
    filters,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    setPage,
    setFilters,
    setSearch,
  };
}

/**
 * Composable for fetching a single user
 */
export function useUser(id: string) {
  const query = useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const result = await userService.getById(id);
      if (result.isFailure) {
        throw new Error(result.error);
      }
      return result.getValue();
    },
    enabled: !!id,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Composable for user mutations (create, update, delete)
 */
export function useUserMutations() {
  const queryClient = useQueryClient();
  const notification = useNotification();

  const createMutation = useMutation({
    mutationFn: async (data: CreateUserDTO) => {
      const result = await userService.create(data);
      if (result.isFailure) {
        throw new Error(result.error);
      }
      return result.getValue();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      notification.success('User created successfully');
    },
    onError: (error: Error) => {
      notification.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDTO }) => {
      const result = await userService.update(id, data);
      if (result.isFailure) {
        throw new Error(result.error);
      }
      return result.getValue();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      notification.success('User updated successfully');
    },
    onError: (error: Error) => {
      notification.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await userService.delete(id);
      if (result.isFailure) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      notification.success('User deleted successfully');
    },
    onError: (error: Error) => {
      notification.error(error.message);
    },
  });

  return {
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
