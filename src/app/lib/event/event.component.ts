import { Component, Input, OnInit } from '@angular/core';
import { EventType } from 'src/app/interfaces';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  @Input() item: EventType | undefined

  constructor() { }

  ngOnInit(): void {
  }

}
