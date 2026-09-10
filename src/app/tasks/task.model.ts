
import { TaskStatus } from './task-status';

//entidad central   del dominio 
export interface TaskModel{
    id:number;
    title:string;
    status:TaskStatus;
    priority: 1 | 2 | 3;
    assignee?: UserModel;
}

export interface UserModel{
    id:number;
    name:string;
}

export type TaskDraft = Omit<TaskModel, 'id'>;
export type TaskSummary = Pick<TaskModel, 'id'|'title'>;
export type TaskPatch = Partial<TaskModel>;
export type StatusCount = Record<TaskStatus,  number>;



