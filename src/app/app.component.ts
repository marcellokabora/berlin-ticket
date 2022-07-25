import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface Event {
  bemerkungen: string
  bezirk: string
  mail: string
  zeit: string
  bis: string
  von: string
  veranstalter: string
  price: number
  stars: number
  special: boolean
  bezeichnung: string
  strasse: string
  outdated: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  events: Event[] = []

  search: string = ''
  outdated: boolean = false
  free: boolean = false

  ratings = this._formBuilder.group({
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
  })
  minrate = 1
  maxrate = 5

  pricing = this._formBuilder.group({
    price1: false,
    price2: false,
    price3: false,
    price4: false,
    price5: false,
  })
  minprice = 0
  maxprice = 1000

  locations: string[] = []
  location = ''
  locationControl = new FormControl('');
  locationOptions: Observable<string[]> = of()

  sortbyControl = new FormControl('');
  sortbyOptions: string[] = ['Price', 'Stars', 'DateStart', 'DateEnd'];

  date1 = ''
  date2 = ''
  sortby = ''

  constructor(
    private http: HttpClient,
    private _formBuilder: FormBuilder
  ) {

    this.http.get("https://www.berlin.de/sen/web/service/maerkte-feste/strassen-volksfeste/index.php/index/all.json?q=").subscribe((data: any) => {
      this.events = data.index.map((event: Event) => {
        event.price = Math.floor(Math.random() * 150);
        if (Math.random() < 0.1) event.price = 0
        event.stars = Math.floor(Math.random() * 6)
        event.special = Math.random() < 0.3
        event.outdated = new Date() >= new Date(event.bis)
        return event
      })

      const unique = (value: any, index: number, self: any) => self.indexOf(value) === index
      this.locations = this.events.map(event => event.bezirk).filter(unique).sort()

      this.locationOptions = this.locationControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      )

    })

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
      this.minrate = rating[0] ? rating[0] : 1
      this.maxrate = rating[rating.length - 1] ? rating[rating.length - 1] + .9 : 5
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
      this.minprice = values.price5 ? 100 : pricing[0] ? pricing[0] : 0
      this.maxprice = pricing[pricing.length - 1] ? pricing[pricing.length - 1] : 1000
    })

    this.locationControl.valueChanges.subscribe(value => {
      this.location = value ? value : ''
    })
    this.sortbyControl.valueChanges.subscribe(value => {
      this.sortby = value ? value : 'DateEnd'
    })

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.locations.filter(option => option.toLowerCase().includes(filterValue))
  }

}

@Pipe({ name: 'rating' })
export class pipeRating implements PipeTransform {
  transform(items: Event[], min: number, max: number): Event[] {
    return items.filter((item: Event) => item.stars >= min && item.stars <= max)
  }
}
@Pipe({ name: 'pricing' })
export class pipePricing implements PipeTransform {
  transform(items: Event[], min: number, max: number, free: boolean): Event[] {
    return items.filter((item: Event) => free ? item.price === 0 : item.price >= min && item.price <= max)
  }
}
@Pipe({ name: 'searching' })
export class pipeSearching implements PipeTransform {
  transform(items: Event[], search: string): Event[] {
    return items.filter((item: Event) => item.bezeichnung.toUpperCase().indexOf(search.toUpperCase()) > -1)
  }
}
@Pipe({ name: 'special' })
export class pipeSpecial implements PipeTransform {
  transform(items: Event[], special: boolean): Event[] {
    return items.filter((item: Event) => special ? true : item.outdated === false)
  }
}
@Pipe({ name: 'location' })
export class pipeLocation implements PipeTransform {
  transform(items: Event[], location: string): Event[] {
    return items.filter((item: Event) => location ? item.bezirk === location : item)
  }
}
@Pipe({ name: 'dates' })
export class pipeDates implements PipeTransform {
  transform(items: Event[], date1: string, date2: string): Event[] {
    return items.filter((item: Event) =>
      !date1 && !date2
        ?
        item
        :
        date1 && date2
          ?
          new Date(item.von) >= new Date(date1) && new Date(item.bis) <= new Date(date2)
          :
          date1
            ?
            new Date(item.von) >= new Date(date1)
            :
            date2
              ?
              new Date(item.bis) <= new Date(date2)
              :
              null
    )
  }
}
@Pipe({ name: 'sortby' })
export class pipeSortby implements PipeTransform {
  transform(items: Event[], sortby: string): Event[] {
    return items.sort((a: any, b: any) => {
      if (sortby === 'Price') {
        return a.price - b.price
      }
      if (sortby === 'Stars') {
        return a.stars - b.stars
      }
      if (sortby === 'DateStart' && a.von && a.von) {
        return new Date(a.von).getTime() - new Date(b.von).getTime()
      }
      if (sortby === 'DateEnd' && a.von && a.von) {
        return new Date(a.bis).getTime() - new Date(b.bis).getTime()
      }
      return a
    })
    // .reverse()
  }
}
