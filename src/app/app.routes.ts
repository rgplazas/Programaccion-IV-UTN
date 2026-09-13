import { Routes } from '@angular/router';
import { TaskBoard } from './tasks/task-board/task-board';
import { TaskList } from './tasks/task-list/task-list';
import { TaskDetail } from './tasks/task-detail/task-detail';
import { TaskForm } from './tasks/task-form/task-form';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'board' },
    { path: 'board', component: TaskBoard },
    { path: 'tasks', component: TaskList },
    { path: 'tasks/new', component: TaskForm },
    { path: 'tasks/:taskId', component: TaskDetail },
    { path: 'tasks/:taskId/edit', component: TaskForm },
    { path: '**', redirectTo: 'board' }
];
