import { Component, model } from '@angular/core';

@Component({
  selector: 'app-priority-picker',
  templateUrl: './priority-picker.html',
  styleUrl: './priority-picker.css'
})
export class PriorityPicker {

  value = model<1 | 2 | 3>(2);

  readonly priorities: (1 | 2 | 3)[] = [1, 2, 3];

  set(priority: 1 | 2 | 3) {
    this.value.set(priority);
  }
}