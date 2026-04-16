export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    estimatedHours: number;
    actualHours?: number;
}
export interface CreateTaskDTO {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    tags: string[];
    estimatedHours: number
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
    status?: TaskStatus;
    actualHours?: number;
}

export interface UIState {
    isModalOpen: boolean;
    modalType: 'CREATE' | 'EDIT' | null;
    selectedTaskId: string | null;
    isLoading: boolean
}

export interface FilterState {
    status: TaskStatus | 'ALL';
    priority: TaskPriority | 'ALL';
    search: string;
    sortBy: 'createdAt' | 'dueDate' | 'priority';
    sortOrder: 'asc' | 'desc'
}

export interface ThemeState {
    mode: 'LIGHT' | 'DARK'
}