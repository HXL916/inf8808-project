// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Component } from './pages/tab1/tab1.component';
import { Tab2Component } from './pages/tab2/tab2.component';
import { Tab3Component } from './pages/tab3/tab3.component';

const routes: Routes = [
  { path: 'tab1', component: Tab1Component },
  { path: 'tab2', component: Tab2Component },
  { path: 'tab3', component: Tab3Component },
  { path: '', redirectTo: '/tab1', pathMatch: 'full' }, // Optional: Redirect to Tab 1 by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
