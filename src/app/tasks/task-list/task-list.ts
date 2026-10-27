import { Component, signal, computed, inject } from '@angular/core';
import { TaskModel } from '../task.model';
import { RouterLink } from '@angular/router';
import { TaskCard } from '../task-card/task-card';
import { TaskStore } from '../../services/task-store.service';

@Component({
  imports: [RouterLink, TaskCard],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  private readonly store = inject(TaskStore);

  filter = signal('');

  tasks = computed(() => {
    const query = this.filter().toLowerCase();
    return this.store.tasks().filter(task =>
      task.title.toLowerCase().includes(query)
    );
  });

  markDone(task: TaskModel): void {
    void this.store.update(task.id, { status: 'done' });
  }

  remove(id: string): void {
    void this.store.remove(id);
  }
}
