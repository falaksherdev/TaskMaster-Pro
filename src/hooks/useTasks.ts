import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StorageService } from "../lib/storage"
import { CreateTaskDTO, UpdateTaskDTO, Task } from '../types'

export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
}
export const useTasks = () => {
    return useQuery({
        queryKey: taskKeys.lists(),
        queryFn: () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(StorageService.getTasks())
                }, 500)
            })
        },
    })
}

export const useCreateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newTask: CreateTaskDTO) => StorageService.createTask(newTask),

        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.lists() })

            const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists())

            const optimisticTask: Task = {
                ...newTask,
                id: crypto.randomUUID(),
                status: 'TODO',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                order: (previousTasks?.length || 0) + 1
            }

            queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) => [...old, optimisticTask])

            return { previousTasks }
        },

        onError: (err, variables, context) => {
            queryClient.setQueryData(taskKeys.lists(), context?.previousTasks)
            alert('Failed to create task')
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
        }
    })
}
export const useUpdateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateTaskDTO & { id: string }) =>
            StorageService.updateTask(id, updates),

        onMutate: async (updatedTask) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.lists() })

            const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists())

            queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) =>
                old.map(task =>
                    task.id === updatedTask.id ? { ...task, ...updatedTask } : task
                )
            )

            return { previousTasks }
        },

        onError: (err, variables, context) => {
            queryClient.setQueryData(taskKeys.lists(), context?.previousTasks)
            alert('Failed to update task')
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
        }
    })
}

// DELETE task
export const useDeleteTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => StorageService.deleteTask(id),

        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.lists() })

            const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists())


            queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) =>
                old.filter(task => task.id !== deletedId)
            )

            return { previousTasks }
        },

        onError: (err, deletedId, context) => {
            queryClient.setQueryData(taskKeys.lists(), context?.previousTasks)
            alert('Failed to delete task')
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
        }
    })
}