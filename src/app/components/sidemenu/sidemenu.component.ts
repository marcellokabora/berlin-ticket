import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent {

  @Input() outdated: boolean = false
  @Output() outdatedChange = new EventEmitter<boolean>()

  @Input() free: boolean = false
  @Output() freeChange = new EventEmitter<boolean>()

  @Input() minrate: number | undefined = undefined
  @Output() minrateChange = new EventEmitter<number>()

  @Input() maxrate: number | undefined = undefined
  @Output() maxrateChange = new EventEmitter<number>()

  @Input() minprice: number | undefined = undefined
  @Output() minpriceChange = new EventEmitter<number>()

  @Input() maxprice: number | undefined = undefined
  @Output() maxpriceChange = new EventEmitter<number>()

  ratings = this._formBuilder.group({
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
  })
  pricing = this._formBuilder.group({
    price1: false,
    price2: false,
    price3: false,
    price4: false,
    price5: false,
  })

  constructor(
    private _formBuilder: FormBuilder
  ) {

    this.ratings.valueChanges.subscribe(values => {
      const rating = []
      if (values.star1) {
        rating.push(1)
      }
      if (values.star2) {
        rating.push(2)
      }
      if (values.star3) {
        rating.push(3)
      }
      if (values.star4) {
        rating.push(4)
      }
      if (values.star5) {
        rating.push(5)
      }
      this.minrateChange.emit(rating[0] ? rating[0] : 1)
      this.maxrateChange.emit(rating[rating.length - 1] ? rating[rating.length - 1] + .9 : 5)
    })

    this.pricing.valueChanges.subscribe(values => {
      const pricing = []
      if (values.price1) {
        pricing.push(0, 10)
      }
      if (values.price2) {
        pricing.push(10, 20)
      }
      if (values.price3) {
        pricing.push(20, 50)
      }
      if (values.price4) {
        pricing.push(50, 100)
      }
      if (values.price5) {
        pricing.push(1000)
      }
      this.minpriceChange.emit(values.price5 && (!values.price1 && !values.price2 && !values.price3 && !values.price4) ? 100 : pricing[0] ? pricing[0] : 0)

      this.maxpriceChange.emit(pricing[pricing.length - 1] ? pricing[pricing.length - 1] : 1000)

    })

  }

}
