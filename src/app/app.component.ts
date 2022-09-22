import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

interface Event {
  id: string
  title: string
  price: number
  stars: number
  date1: Date
  date2: Date
  special: boolean
  outdated: boolean
  location: string
  company: string
  time: string
  cover: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  events: Event[] = []

  outdated: boolean = false
  free: boolean = false
  minprice: number = 0
  maxprice: number = 1000
  minrate: number = 1
  maxrate: number = 5
  search: string = ''
  locations: string[] = []
  location = ''
  locationControl = new FormControl('');
  locationOptions: Observable<string[]> = of()
  sortbyControl = new FormControl('');
  sortbyOptions: string[] = ['Price', 'Stars', 'date1', 'date2'];
  date1 = ''
  date2 = ''
  sortby = ''
  data: any[] = []

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      this.minprice = queryParams.minprice ? queryParams.minprice : 0
      this.maxprice = queryParams.maxprice ? queryParams.maxprice : 1000
      this.minrate = queryParams.minrate ? queryParams.minrate : 1
      this.maxrate = queryParams.maxrate ? queryParams.maxrate : 5
    })

    this.http.get('/assets/data.json').subscribe((data: any) => {
      this.events = data.map((event: Event) => {
        if (Math.random() < 0.1) event.price = 0
        event.stars = Math.floor(Math.random() * 5 + 1)
        event.special = Math.random() < 0.3
        event.outdated = new Date('2022/08/1') >= new Date(event.date2)
        event.time = '9am - 4pm'
        return event
      })

      const unique = (value: any, index: number, self: any) => self.indexOf(value) === index
      this.locations = this.events.map(event => event.location).filter(unique).sort()

      this.locationOptions = this.locationControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      )

    })

    this.locationControl.valueChanges.subscribe(value => {
      this.location = value ? value : ''
    })
    this.sortbyControl.valueChanges.subscribe(value => {
      this.sortby = value ? value : 'date2'
    })

  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.locations.filter(option => option?.toLowerCase().includes(filterValue))
  }

}

@Pipe({ name: 'rating' })
export class pipeRating implements PipeTransform {
  transform(items: Event[], min: number | undefined, max: number | undefined): Event[] {
    return items.filter((item: Event) =>
      min && max
        ?
        item.stars >= min && item.stars <= max
        :
        item)
  }
}
@Pipe({ name: 'pricing' })
export class pipePricing implements PipeTransform {
  transform(items: Event[], min: number, max: number): Event[] {
    return items.filter((item: Event) =>
      (min && max)
        ?
        (item.price >= min && item.price <= max)
        :
        max
          ?
          item.price <= max
          :
          min
            ?
            item.price >= min
            :
            items
    )
  }
}
@Pipe({ name: 'searching' })
export class pipeSearching implements PipeTransform {
  transform(items: Event[], search: string): Event[] {
    return items.filter((item: Event) => item.title.toUpperCase().indexOf(search.toUpperCase()) > -1)
  }
}
@Pipe({ name: 'outdated' })
export class pipeOutdated implements PipeTransform {
  transform(items: Event[], outdated: boolean): Event[] {
    return items.filter((item: Event) => outdated ? true : item.outdated === false)
  }
}
@Pipe({ name: 'location' })
export class pipeLocation implements PipeTransform {
  transform(items: Event[], location: string): Event[] {
    return items.filter((item: Event) => location ? item.location === location : item)
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
          new Date(item.date1) >= new Date(date1) && new Date(item.date2) <= new Date(date2)
          :
          date1
            ?
            new Date(item.date1) >= new Date(date1)
            :
            date2
              ?
              new Date(item.date2) <= new Date(date2)
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
      if (sortby === 'date1' && a.von && a.von) {
        return new Date(a.von).getTime() - new Date(b.von).getTime()
      }
      if (sortby === 'date2' && a.von && a.von) {
        return new Date(a.bis).getTime() - new Date(b.bis).getTime()
      }
      return a
    })
    // .reverse()
  }
}
