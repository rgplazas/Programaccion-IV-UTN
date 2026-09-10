import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityPicker } from './priority-picker';

describe('PriorityPicker', () => {
  let component: PriorityPicker;
  let fixture: ComponentFixture<PriorityPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
