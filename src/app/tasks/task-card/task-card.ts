import { Component, input, output, numberAttribute } from '@angular/core';
import { TaskModel } from '../task.model';

@Component({
  imports: [],
  selector: 'app-task-card',
  styleUrl: './task-card.css',
  templateUrl: './task-card.html',
})
export class TaskCard {

  task = input.required<TaskModel>();

  compact = input(false);

  days = input.required<unknown, number>({transform:numberAttribute});

  size = input('md', {alias:'cardSize'});

  done = output<TaskModel>();

  deleted = output<number>();

  onDone(){this.done.emit(this.task());}
  
  onDelete(){this.deleted.emit(this.task().id);}
}
