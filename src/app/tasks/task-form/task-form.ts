import { Component, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, required, minLength, maxLength, min, max, FormField, FormRoot } from '@angular/forms/signals';
import { PriorityPicker } from '../priority-picker/priority-picker';
import { TaskStore } from '../../task.store';
import { TaskDraft } from '../task.model';

@Component({
  selector: 'app-task-form',
  imports: [FormField, FormRoot, RouterLink, PriorityPicker],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {
  private readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  // presente solo en la ruta /tasks/:taskId/edit 
  taskId = input<number, undefined>(undefined, { transform: numberAttribute });

  // paso 1 · el borrador como signal del dominio 
  protected draft = signal<TaskDraft>({
    title: '',
    status: 'pending',
    priority: 2
  });

  // paso 2 · form() crea el FieldTree; paso 3 · validadores con mensajes 
  protected taskForm = form(this.draft, f => {
    required(f.title, { message: 'El título es obligatorio' });
    minLength(f.title, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(f.title, 80, { message: 'Máximo 80 caracteres' });
    min(f.priority, 1);
    max(f.priority, 3, { message: 'La prioridad va de 1 a 3' });
  }, {
    // paso 4 · el envío: solo si es válido 
    submission: {
      action: async () => {
        const id = this.taskId();
        if (id) {
          this.store.update(id, this.draft());
        } else {
          this.store.add(this.draft());
        }
        await this.router.navigate(['/tasks']);
      }   
    }
  });

  constructor() {
    // edición: precargar el borrador con la tarea de la ruta 
    effect(() => {
      const id = this.taskId();
      if (!id) return 
      const t = this.store.find(id);
      if(t){
        this.draft.set({title: t.title, status: t.status, priority: t.priority});
      }
    });
  }
} 