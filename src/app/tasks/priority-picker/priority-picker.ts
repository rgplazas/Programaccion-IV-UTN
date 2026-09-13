import { Component, model } from '@angular/core';

@Component({
  selector: 'app-priority-picker',
  templateUrl: './priority-picker.html',
  styleUrl: './priority-picker.css'
})
export class PriorityPicker {

  value = model<number>(2);   // input + output priorityChange, juntos 

  set(p: number) { 
    this.value.set(p);        // notifica al padre automáticamente 
  } 

  /*value = model<1 | 2 | 3>(2);

  readonly priorities: (1 | 2 | 3)[] = [1, 2, 3];

  set(priority: 1 | 2 | 3) {
    this.value.set(priority);
  }*/
}