import { Component, computed, inject } from '@angular/core';
import { TaskCard } from '../task-card/task-card';
import { TaskModel } from '../task.model';
import { TaskStatus, COLUMN_LABELS } from '../task-status';
import { TaskStore } from '../../services/task-store.service';

@Component({
  selector: 'app-task-board',
  imports: [TaskCard],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css'
})
export class TaskBoard {
  private readonly store = inject(TaskStore);

  columns = (Object.keys(COLUMN_LABELS) as TaskStatus[]).map(status => ({
    status,
    label: COLUMN_LABELS[status],
  }));

  readonly tasksByStatus = computed(() => {
    const groups: Record<TaskStatus, TaskModel[]> = {
      pending: [],
      'in-progress': [],
      done: [],
    };

    for (const task of this.store.tasks()) {
      groups[task.status].push(task);
    }

    return groups;
  });

  /*markDone(task: TaskModel) {
    this.store.update(task.id, {status:'done'});
  }

  remove(id: number) {
    this.store.remove(id);
  }*/
} 