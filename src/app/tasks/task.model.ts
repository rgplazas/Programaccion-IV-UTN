import { TaskStatus } from './task-status';

// Entidad central del dominio. MongoDB identifica las tareas con un ObjectId (string).
export interface TaskModel {
    id: string;
    title: string;
    status: TaskStatus;
    priority: 1 | 2 | 3;
    assignee?: UserModel;
    updated_at?: string;
}

export interface UserModel {
    id: number;
    name: string;
}

export type TaskDraft = Omit<TaskModel, 'id' | 'updated_at'>;
export type TaskPatch = Partial<TaskModel>;

export function createEmptyTaskDraft(): TaskDraft {
    return {
        title: '',
        status: 'pending',
        priority: 2,
    };
}
