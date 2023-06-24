import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { PreprocessingService } from 'src/app/services/preprocessing.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})
export class Tab3Component  implements AfterViewInit  {
  wantedKey:string;

  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey='genre';
  }

  ngAfterViewInit(): void {
    
  }

  createGraph(data:any): void {
    
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    this.updateView();
  }
  updateView():void{         //importer data une fois seulment à place de le refaire à chaque changement
    //this.createGraph(this.process(this.sortedData[this.wantedLegislature]));
  }
}
