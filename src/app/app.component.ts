import { Component, OnInit } from '@angular/core';
import { PreprocessingService } from './services/preprocessing.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project-inf8808';
  constructor(private preprocessing:PreprocessingService) { }
}
