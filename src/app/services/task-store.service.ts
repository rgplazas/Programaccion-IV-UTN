import { Injectable, effect, inject, signal } from '@angular/core';
import { TaskModel, TaskDraft } from '../tasks/task.model';
import { TaskApi } from '../tasks/task-api.service';

@Injectable({ providedIn: 'root' })
export class TaskStore {
    private readonly api = inject(TaskApi);

    readonly tasks = signal<TaskModel[]>([]);
    readonly loading = signal(true);

    private readonly currentUserId = signal<string | null | undefined>(null);
    private activeUserId: string | undefined;

    setUser(uid: string | undefined): void {
        this.currentUserId.set(uid);
    }

    constructor() {
        effect(() => {
            const uid = this.currentUserId();

            if (uid === null) return;

            if (uid === undefined) {
                this.tasks.set([]);
                this.loading.set(false);
                this.activeUserId = undefined;
                return;
            }

            if (this.activeUserId !== uid) {
                this.activeUserId = uid;
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

    find(id: string): TaskModel | undefined {
        return this.tasks().find(task => task.id === id);
    }

    async add(draft: TaskDraft): Promise<TaskModel> {
        const created = await this.api.add(draft);
        this.tasks.update(list => [created, ...list]);
        return created;
    }

    async update(id: string, patch: Partial<TaskModel>): Promise<void> {
        const updated = await this.api.update(id, patch);
        this.tasks.update(list =>
            list.map(task => task.id === id ? updated : task)
        );
    }

    async remove(id: string): Promise<void> {
        await this.api.remove(id);
        this.tasks.update(list => list.filter(task => task.id !== id));
    }
}
