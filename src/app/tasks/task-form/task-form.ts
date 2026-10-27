import { Component, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, required, minLength, maxLength, min, max, FormField, FormRoot } from '@angular/forms/signals';
import { PriorityPicker } from '../priority-picker/priority-picker';
import { TaskDraft, createEmptyTaskDraft } from '../task.model';
import { AttachmentsService } from '../../services/attachments';
import { TaskStore } from '../../services/task-store.service';

@Component({
  selector: 'app-task-form',
  imports: [FormField, FormRoot, RouterLink, PriorityPicker],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {
  private readonly store = inject(TaskStore);
  private readonly router = inject(Router);
  private readonly attachments = inject(AttachmentsService);

  // Presente solo en la ruta /tasks/:taskId/edit. El ObjectId de Mongo es string.
  taskId = input<string | undefined, unknown>(undefined, {
    transform: value => value === undefined || value === null || value === ''
      ? undefined
      : String(value),
  });

  protected draft = signal<TaskDraft>(createEmptyTaskDraft());
  protected attachment = signal<File | null>(null);
  protected saving = signal(false);
  protected submitError = signal<string | null>(null);
  private readonly createdTaskId = signal<string | null>(null);

  protected onAttachmentChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.attachment.set(input.files?.[0] ?? null);
    this.submitError.set(null);
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;

    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      const details = 'details' in error && typeof error.details === 'string' ? error.details : '';
      const hint = 'hint' in error && typeof error.hint === 'string' ? error.hint : '';
      return [error.message, details, hint].filter(Boolean).join(' ');
    }

    return 'Error desconocido.';
  }

  protected taskForm = form(this.draft, f => {
    required(f.title, { message: 'El título es obligatorio' });
    minLength(f.title, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(f.title, 80, { message: 'Máximo 80 caracteres' });
    min(f.priority, 1);
    max(f.priority, 3, { message: 'La prioridad va de 1 a 3' });
  }, {
    submission: {
      action: async () => {
        this.saving.set(true);
        this.submitError.set(null);

        try {
          const id = this.taskId() ?? this.createdTaskId();
          let savedId: string;

          try {
            if (id !== null && id !== undefined) {
              await this.store.update(id, this.draft());
              savedId = id;
            } else {
              const created = await this.store.add(this.draft());
              savedId = created.id;
              this.createdTaskId.set(savedId);
            }
          } catch (error) {
            this.submitError.set(`No se pudo guardar la tarea: ${this.errorMessage(error)}`);
            return;
          }

          const file = this.attachment();
          if (file) {
            try {
              await this.attachments.upload(savedId, file);
            } catch (error) {
              this.submitError.set(`La tarea se guardó, pero no se pudo subir el adjunto: ${this.errorMessage(error)}`);
              return;
            }
          }

          await this.router.navigate(['/tasks']);
        } finally {
          this.saving.set(false);
        }
      }
    }
  });

  constructor() {
    effect(() => {
      const id = this.taskId();
      if (!id) return;

      const task = this.store.find(id);
      if (task) {
        this.draft.set({
          title: task.title,
          status: task.status,
          priority: task.priority,
        });
      }
    });
  }
}
