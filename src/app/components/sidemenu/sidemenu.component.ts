import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent {

  outdated: boolean = false

  @Input() minPrice = 0
  @Input() maxPrice = 100

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  updateQuery(value: any) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: value,
      queryParamsHandling: 'merge'
    })
  }


}
