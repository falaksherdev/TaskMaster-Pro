import { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus } from "../types";

const STORAGE_KEYS = {
    TASKS: 'taskmaster_tasks',
} as const;

export class StorageService {
    private static getItem<T>(key: string): T | null {
        if (typeof window === 'undefined') return null;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null
    }
    private static setItem<T>(key: string, value: T): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value))
    }

    static getTasks(): Task[] {
        return this.getItem<Task[]>(STORAGE_KEYS.TASKS) || []
    }
    static saveTasks(tasks: Task[]): void {
        this.setItem(STORAGE_KEYS.TASKS, tasks)
    }
    static getTaskById(id: string): Task | null {
        const tasks = this.getTasks()
        return tasks.find(task => task.id === id) || null
    }
    static createTask(taskData: CreateTaskDTO): Task {
        const tasks = this.getTasks()
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            status: "TODO",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            order: tasks.length + 1
        }
        tasks.push(newTask)
        this.saveTasks(tasks)
        return newTask
    }
    static updateTask(id: string, updates: UpdateTaskDTO): Task | null {
        const tasks = this.getTasks()
        const index = tasks.findIndex(task => task.id === id)
        if (index === -1) return null;
        const updatedTask = {
            ...tasks[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        tasks[index] = updatedTask
        this.saveTasks(tasks)

        return updatedTask
    }
    static deleteTask(id: string): boolean {
        const tasks = this.getTasks()
        const filtered = tasks.filter(task => task.id !== id)
        if (filtered.length === tasks.length) return false
        this.saveTasks(filtered)
        return true;
    }
    static bulkUpdateTasks(updates: { id: string; status: TaskStatus }[]): Task[] {
        const tasks = this.getTasks();
        const updatedTasks = tasks.map(task => {
            const update = updates.find(u => u.id === task.id);
            if (update) {
                return { ...task, status: update.status, updatedAt: new Date().toISOString() };
            }
            return task;
        });

        this.saveTasks(updatedTasks);
        return updatedTasks;
    }
}