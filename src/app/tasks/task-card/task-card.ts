import { Component, input, output, numberAttribute } from '@angular/core';
import { statusLabel } from '../task-status';
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

  days = input(0, {transform:numberAttribute});

  size = input<'sm' | 'md' | 'lg'>('md', { alias: 'cardSize' }); 

  done = output<TaskModel>();

  deleted = output<number>();

  label = statusLabel;

  onDone(){this.done.emit(this.task());}
  
  onDelete(){this.deleted.emit(this.task().id);}
}
