import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Tab1Component } from './pages/tab1/tab1.component';
import { Tab2Component } from './pages/tab2/tab2.component';
import { Tab3Component } from './pages/tab3/tab3.component';
import { TopFlopComponent } from './pages/tab1/top-flop/top-flop.component';
import { FilterButtonComponent } from './components/filter-button/filter-button.component';
import { PreprocessingService } from './services/preprocessing.service';
import { InterventionTypeToggleComponent } from './components/intervention-type-toggle/intervention-type-toggle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

@NgModule({
  declarations: [
    AppComponent,
    Tab1Component,
    Tab2Component,
    Tab3Component,
    TopFlopComponent,
    FilterButtonComponent,
    InterventionTypeToggleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatChipsModule,
  ],
  providers: [PreprocessingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
