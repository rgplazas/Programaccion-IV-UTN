import { Component, signal, computed, inject } from '@angular/core';
import { TaskModel } from '../task.model';
import { RouterLink } from '@angular/router';
import { TaskCard } from '../task-card/task-card';
import { TaskStore } from '../../services/task-store.service';
//import { TaskApi } from '../task-api.service';

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
    const q = this.filter().toLowerCase();
    return this.store.tasks().filter(t => t.title.toLowerCase().includes(q))
  })

  /*markDone(task: TaskModel) {
    this.store.update(task.id, {status:'done'});
  }

  remove(id: number) {
    this.store.remove(id);
  }*/
}
