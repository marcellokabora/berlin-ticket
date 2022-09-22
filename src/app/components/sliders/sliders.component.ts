import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})
export class SlidersComponent {

  @Input() title: string = 'Rating'
  @Input() min: number = 1
  @Input() max: number = 5
  @Input() step: number = 1
  @Input() minValue: number = 1
  @Output() minValueChange = new EventEmitter<number>()
  @Input() maxValue: number = 5
  @Output() maxValueChange = new EventEmitter<number>()

}
