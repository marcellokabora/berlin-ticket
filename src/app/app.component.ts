import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  outdated: boolean = false
  free: boolean = false
  minrate: number | undefined = 1
  maxrate: number | undefined = undefined
  minprice: number | undefined = undefined
  maxprice: number | undefined = undefined

  search: string = ''
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
  ) {

    this.http.get("https://www.berlin.de/sen/web/service/maerkte-feste/strassen-volksfeste/index.php/index/all.json?q=").subscribe((data: any) => {
      this.events = data.index.map((event: Event) => {
        event.price = Math.floor(Math.random() * 150);
        if (Math.random() < 0.1) event.price = 0
        event.stars = Math.floor(Math.random() * 5 + 1)
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
  transform(items: Event[], min: number | undefined, max: number | undefined, free: boolean): Event[] {
    return items.filter((item: Event) =>
      free
        ?
        item.price === 0
        :
        (min || min === 0) && max
          ?
          item.price >= min && item.price <= max
          :
          items)
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
