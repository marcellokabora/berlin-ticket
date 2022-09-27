import { Component, ViewEncapsulation } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Pipe, PipeTransform } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'
import { EventType } from './interfaces'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  events: EventType[] = []

  outdated: boolean = false
  free: boolean = false
  minprice: number = 0
  maxprice: number = 1000
  minrate: number = 1
  maxrate: number = 5
  search: string = ''
  locations: string[] = []
  location = ''
  locationControl = new FormControl('')
  locationOptions: Observable<string[]> = of()
  sortbyControl = new FormControl('')
  sortbyOptions: string[] = ['Price', 'Stars', 'date1', 'date2']
  date1 = ''
  date2 = ''
  sortby = ''
  data: any[] = []
  movies = ['aceventura', 'americanpsycho', 'drstrangermultiverse', 'fightclub', 'glass', 'hancock', 'iamlegend', 'jaws', 'jonwich', 'pulpfiction', 'thegodfather', 'thejoker', 'themask', 'theshining', 'thewolfofwalstreet', 'thorloveandthunder']

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      this.minprice = queryParams.minprice ? Number(queryParams.minprice) : 0
      this.maxprice = queryParams.maxprice ? Number(queryParams.maxprice) : 1000
      this.minrate = queryParams.minrate ? Number(queryParams.minrate) : 1
      this.maxrate = queryParams.maxrate ? Number(queryParams.maxrate) : 5
      this.outdated = queryParams.outdated === 'true' ? true : false
    })

    this.http.get('/assets/data.json').subscribe((data: any) => {
      this.events = data.map((EventType: EventType) => {
        if (Math.random() < 0.1) EventType.price = 0
        EventType.stars = Math.floor(Math.random() * 5 + 1)
        EventType.special = Math.random() < 0.3
        EventType.outdated = new Date('2022/10/1') >= new Date(EventType.date2)
        EventType.time = '9am - 4pm'
        EventType.cover = '/assets/movies/' + this.movies[Math.floor(Math.random() * this.movies.length)] + '.jpg'
        return EventType
      })

      const unique = (value: any, index: number, self: any) => self.indexOf(value) === index
      this.locations = this.events.map(EventType => EventType.location).filter(unique).sort()

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
  transform(items: EventType[], min: number | undefined, max: number | undefined): EventType[] {
    return items.filter((item: EventType) =>
      min && max
        ?
        item.stars >= min && item.stars <= max
        :
        item)
  }
}
@Pipe({ name: 'pricing' })
export class pipePricing implements PipeTransform {
  transform(items: EventType[], min: number, max: number): EventType[] {
    return items.filter((item: EventType) =>
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
  transform(items: EventType[], search: string): EventType[] {
    return items.filter((item: EventType) => item.title.toUpperCase().indexOf(search.toUpperCase()) > -1)
  }
}
@Pipe({ name: 'outdated' })
export class pipeOutdated implements PipeTransform {
  transform(items: EventType[], outdated: boolean): EventType[] {
    return items.filter((item: EventType) => outdated ? true : item.outdated === false)
  }
}
@Pipe({ name: 'location' })
export class pipeLocation implements PipeTransform {
  transform(items: EventType[], location: string): EventType[] {
    return items.filter((item: EventType) => location ? item.location === location : item)
  }
}
@Pipe({ name: 'dates' })
export class pipeDates implements PipeTransform {
  transform(items: EventType[], date1: string, date2: string): EventType[] {
    return items.filter((item: EventType) =>
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
  transform(items: EventType[], sortby: string): EventType[] {
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
