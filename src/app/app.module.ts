import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Tab1Component } from './pages/tab1/tab1.component';
import { Tab2Component } from './pages/tab2/tab2.component';
import { Tab3Component } from './pages/tab3/tab3.component';
import { TopFlopComponent } from './components/top-flop/top-flop.component';
import { FilterButtonComponent } from './components/filter-button/filter-button.component';
import { PreprocessingService } from './services/preprocessing.service';
import { InterventionTypeToggleComponent } from './components/intervention-type-toggle/intervention-type-toggle.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';

@NgModule({
  declarations: [
    AppComponent,
    Tab1Component,
    Tab2Component,
    Tab3Component,
    TopFlopComponent,
    FilterButtonComponent,
    InterventionTypeToggleComponent,
    DatePickerComponent,
    LoadingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    PreprocessingService,
    {provide: MAT_DATE_LOCALE, useValue: 'fr-CA'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
