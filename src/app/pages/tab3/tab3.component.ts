import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as waffle1 from 'src/app/pages/tab1/waffle';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import { partyColorScale } from "../../utils/scales"

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})
export class Tab3Component  implements AfterViewInit  {
  wantedKey:string;
  colorScale!: any;
  data!:any;

  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey='genre';
  }

  ngAfterViewInit(): void {d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (data)=>{ 
    this.data=data;    
    this.createGraph(this.process(data));
  });
  }

  createGraph(data:any): void {
    
    waffle1.drawWaffleLegend(this.colorScale);
    
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    this.updateView();
  }
  updateView():void{         //importer data une fois seulment à place de le refaire à chaque changement
    this.createGraph(this.process(this.data));
  }

  /**
 * Keeps only the MPs from the selected Legislature.
 *
 * @param {object[]} data The data to analyze
 * @returns {object[]} output The data filtered
 */
  process(data: { [key: string]: any }[]):{ [key: string]: any }[]{
    switch (this.wantedKey){
      case "genre":
        this.colorScale = d3.scaleOrdinal().domain(["H","F"]).range(["#50BEB8","#772A93"]);
        break;
      case "parti":
        //let affiliations = this.preprocessingService.getPartiesNames(data);
        this.colorScale = partyColorScale//d3.scaleOrdinal().domain(affiliations).range(["#159CE1","#AAAAAA","#FF8514","#002395","#ED2E38","#30D506"]);
        break;
      case "province":
        let provinces = data.map(obj => obj["province"]).sort();
        this.colorScale = d3.scaleOrdinal().domain(provinces).range(d3.schemeTableau10);
        break;
    } 

    return data.sort((x, y) => d3.ascending(x[this.wantedKey], y[this.wantedKey]));
  }
}
