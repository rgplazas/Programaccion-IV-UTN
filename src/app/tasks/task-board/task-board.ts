import { Component, computed, inject } from '@angular/core'; 
import { TaskCard } from '../task-card/task-card'; 
import { TaskStore } from '../../task.store'; 
import { TaskModel } from '../task.model'; 
import { TaskStatus } from '../task-status'; 
 
@Component({ 
  selector: 'app-task-board', 
  imports: [TaskCard], 
  templateUrl: './task-board.html', 
  styleUrl: './task-board.css' 
}) 
export class TaskBoard { 
  private readonly store = inject(TaskStore); 
 
  columns: { status: TaskStatus; label: string }[] = [ 
    { status: 'pending',     label: 'Pendientes' }, 
    { status: 'in-progress', label: 'En curso' }, 
    { status: 'done',        label: 'Hechas' } 
  ]; 
 
  byStatus(status: TaskStatus) { 
    return computed(() => this.store.tasks().filter(t => t.status === status)); 
  } 
 
  markDone(task: TaskModel) { 
    this.store.update(task.id, { status: 'done' }); 
  } 
 
  remove(id: number) { 
    this.store.remove(id); 
  } 
} 