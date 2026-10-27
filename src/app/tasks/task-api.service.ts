import { Injectable } from '@angular/core';
import { TaskModel, TaskDraft } from './task.model';
import { environments } from '../../environments/environments';

// Servicio delgado: SOLO habla con la API. No guarda estado,
@Injectable({ providedIn: 'root' })
export class TaskApi {
    private readonly API = environments.production ? 'https://taskflow-api-4pjt.onrender.com/':'http://localhost:3000';
    private toModel = (d:any):TaskModel => ({...d, id: d._id,updated_at: d.updatedAt}); 
    
    async loadAll(): Promise<TaskModel[]> {
        const r = await fetch(`${this.API}/tasks`)
        return (await r.json()).map(this.toModel);
    }

    async add(draft: TaskDraft): Promise<void> {
        await fetch(`${this.API}/tasks`),{
            method:'POST',
            headers:{'Content-Type':'aplication/json'},
            body:JSON.stringify(draft)
        }
    }

    async update(id: string, patch: Partial<TaskModel>): Promise<void> {
        await fetch(`${this.API}/tasks/${id}`),{
            method:'PUT',
            headers:{'Content-Type':'aplication/json'},
            body:JSON.stringify(patch)
        }
    }

    async remove(id: string): Promise<void> {
        await fetch(`${this.API}/tasks/${id}`),{
            method:'DELETE'
        }
    }
}
