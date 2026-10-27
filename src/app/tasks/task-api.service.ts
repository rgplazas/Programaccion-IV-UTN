import { Injectable } from '@angular/core';
import { TaskModel, TaskDraft } from './task.model';
import { environments } from '../../environments/environments';

// Servicio delgado: SOLO habla con la API. No guarda estado.
@Injectable({ providedIn: 'root' })
export class TaskApi {
    private readonly API = environments.apiUrl.replace(/\/+$/, '');

    private toModel = (document: any): TaskModel => ({
        id: document._id ?? document.id,
        title: document.title,
        status: document.status,
        priority: Number(document.priority) as 1 | 2 | 3,
        updated_at: document.updatedAt,
    });

    private async request(path: string, options?: RequestInit): Promise<Response> {
        const response = await fetch(`${this.API}${path}`, options);

        if (!response.ok) {
            const detail = await response.text();
            throw new Error(`La API respondió ${response.status}: ${detail}`);
        }

        return response;
    }

    async loadAll(): Promise<TaskModel[]> {
        const response = await this.request('/tasks');
        return (await response.json()).map(this.toModel);
    }

    async add(draft: TaskDraft): Promise<TaskModel> {
        const response = await this.request('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(draft),
        });

        return this.toModel(await response.json());
    }

    async update(id: string, patch: Partial<TaskModel>): Promise<TaskModel> {
        const response = await this.request(`/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
        });

        return this.toModel(await response.json());
    }

    async remove(id: string): Promise<void> {
        await this.request(`/tasks/${id}`, {
            method: 'DELETE',
        });
    }
}
