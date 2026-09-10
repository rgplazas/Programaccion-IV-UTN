import { Injectable, signal } from "@angular/core";
import { TaskModel } from "./tasks/task.model";

@Injectable({providedIn:'root'})
export class TaskStore{
    
readonly tasks = signal<TaskModel[]>(
    [
      {id: 1, title: 'Cerrar balance Q3', status: 'pending', priority: 2},
      {id: 2, title: 'Revisar PRs', status: 'in-progress', priority: 2},
      {id: 3, title: 'Deploy v2.1', status: 'done', priority: 2},
      {id: 4, title: 'Armar Presentación', status: 'pending', priority: 2}
    ]
  );

  find(id:number):TaskModel | undefined {
    return this.tasks().find(t => t.id === id);
  }

  add(draft:Omit<TaskModel,'id'>):TaskModel{
    const id = Math.max(0, ...this.tasks().map(t => t.id)) + 1;
    const task:TaskModel = {id,...draft};
    this.tasks.update(list => [...list, task]);
    return task;
  }

  update(id:number, path:Partial<TaskModel>):void{
    this.tasks.update(list =>
        list.map(t => (t.id === id ? {...t, ...path}:t))
    );
  }

  remove(id:number):void{
    this.tasks.update(list => list.filter(t => t.id !== id));
  }

}