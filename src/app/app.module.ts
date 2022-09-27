import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {
  AppComponent,
  pipeRating,
  pipePricing,
  pipeSearching,
  pipeOutdated,
  pipeSortby,
  pipeLocation,
  pipeDates,
} from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { MatSliderModule } from '@angular/material/slider';
import { SlidersComponent } from './components/sliders/sliders.component';
import { EventComponent } from './components/event/event.component';

@NgModule({
  declarations: [
    AppComponent,
    pipeRating,
    pipePricing,
    pipeSearching,
    pipeOutdated,
    pipeSortby,
    pipeLocation,
    pipeDates,
    SidemenuComponent,
    SlidersComponent,
    EventComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    HttpClientModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
