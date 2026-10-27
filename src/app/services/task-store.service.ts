import {
  Injectable,
  effect,
  inject,
  signal
} from '@angular/core';

import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload
} from '@supabase/supabase-js';

import {
  TaskModel,
  TaskDraft
} from '../tasks/task.model';

import { TaskApi } from '../tasks/task-api.service';
import { supabase } from './supabase.client';

@Injectable({
  providedIn: 'root'
})
export class TaskStore {

  private readonly api = inject(TaskApi);

  readonly tasks = signal<TaskModel[]>([]);
  readonly loading = signal(true);

  private readonly currentUserId =
    signal<string | null | undefined>(null);
  //private realtimeChannel: RealtimeChannel | null = null;
  private activeUserId: string | undefined;

  setUser(uid: string | undefined): void {
    this.currentUserId.set(uid);
  }

  constructor() {

    effect(() => {

      const uid = this.currentUserId();

      if (uid === null) {
        return;
      }

      if (uid === undefined) {
        this.tasks.set([]);
        this.loading.set(false);
        //this.stopRealtime();
        this.activeUserId = undefined;
        return;
      }

      if (this.activeUserId !== uid) {
        //this.stopRealtime();
        this.activeUserId = uid;
        //this.subscribeRealtime();
        void this.load();
      }
    });
  }

  async load(): Promise<void> {

    const userId = this.currentUserId();
    if (userId === null || userId === undefined) return;

    this.loading.set(true);

    try {
      const tasks = await this.api.loadAll();
      if (this.currentUserId() === userId) this.tasks.set(tasks);
    } finally {
      if (this.currentUserId() === userId) this.loading.set(false);
    }
  }

  find(id: number): TaskModel | undefined {

    return this.tasks()
      .find(t => t.id === id);
  }

  /*async add(
    draft: TaskDraft
  ): Promise<TaskModel> {

    const created = await this.api.add(draft);
    this.tasks.update(list => [...list,created]);
    return created;
  }

  async update(
    id: number,
    patch: Partial<TaskModel>
  ): Promise<void> {

    await this.api.update(id, patch);

    this.tasks.update(list =>
      list.map(t =>
        t.id === id
          ? { ...t, ...patch }
          : t
      )
    );
  }

  async remove(id: number): Promise<void> {

    await this.api.remove(id);

    this.tasks.update(list =>
      list.filter(t => t.id !== id)
    );
  }

  private subscribeRealtime(): void {

    this.realtimeChannel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload: RealtimePostgresChangesPayload<TaskModel>) => {
          this.applyChange(payload);
        }
      )
      .subscribe();
  }

  private stopRealtime(): void {
    if (!this.realtimeChannel) return;
    void supabase.removeChannel(this.realtimeChannel);
    this.realtimeChannel = null;
  }

  private applyChange(
    p: RealtimePostgresChangesPayload<TaskModel>
  ): void {

    switch (p.eventType) {

      case 'INSERT': {

        const task = p.new;

        this.tasks.update(ts =>
          ts.some(t => t.id === task.id)
            ? ts
            : [...ts, task]
        );

        break;
      }

      case 'UPDATE': {

        const task = p.new;

        this.tasks.update(ts =>
          ts.map(t =>
            t.id === task.id
              ? task
              : t
          )
        );

        break;
      }

      case 'DELETE': {

        const id = p.old.id;

        this.tasks.update(ts =>
          ts.filter(t => t.id !== id)
        );

        break;
      }
    }
  }*/
}