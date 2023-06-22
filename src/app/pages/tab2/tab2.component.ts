import { Component, AfterViewInit} from '@angular/core';
import * as d3 from 'd3';
import * as d3Legend from 'd3-svg-legend';
import * as preprocess from './preprocessTab2';
import * as waffle from 'src/app/utils/waffle';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css']
})
export class Tab2Component  implements AfterViewInit   {
  colorScale!: any;
  wantedKey:string;
  wantedLegislature:number;
  
  constructor() {
    this.wantedKey = "genre";
    this.wantedLegislature = 44;
  }

  ngAfterViewInit(): void {
    d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (data)=>{
      let sortedData = preprocess.splitByLegislature(data);
      this.createGraph(this.process(data));
    });
    
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    this.ngAfterViewInit();
  }
  /*
  (change)="updateLegislature($event)"
  updateLegislature(event: React.ChangeEvent<HTMLInputElement>):void{
    this.wantedLegislature=event.value;
    this.ngAfterViewInit();
  }
  */
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
        let affiliations = preprocess.getPartiesNames(data);
        this.colorScale = d3.scaleOrdinal().domain(affiliations).range(["#159CE1","#AAAAAA","#FF8514","#002395","#ED2E38","#30D506"]);
        break;
      case "province":
        let provinces = data.map(obj => obj["province"]).sort();
        this.colorScale = d3.scaleOrdinal().domain(provinces).range(d3.schemeTableau10);
        break;
    } 

    // Filter the MPs from this legislature
    return data.filter((d)=>d['legislature'] == this.wantedLegislature)
               .sort((x, y)=>d3.ascending(x[this.wantedKey], y[this.wantedKey]));
  }


/**
 * Draws the waffle chart
 *
 * @param {object[]} data The data to use
 */
  createGraph(data: { [key: string]: any }[]): void {
    // Draw each seat 
    waffle.drawSquares(data, '#graph-container',this.colorScale,this.wantedKey);

    // Rearrange the seats to make it looks more like the house 
    this.lookLikeHouseOfCommons();

    /*
    // Draw Legend
    svg.append('g')
      .attr('class', 'legend');

    var legend = d3Legend.legendColor()
        .title('Légende')
        .shapePadding(5)
        .cells(6)
        .orient('vertical')
        .scale(this.colorScale) as any;
  
    svg.select('.legend')
        .call(legend);
    */
         
  }

  lookLikeHouseOfCommons(nbBlocCol = 4,nbBlocRow = 5):void{
    let bigGap = 10,
        alleyGap = 20;
    
    // Improve placement of the squares
    for (let i=0;i<nbBlocCol;i++){
      for (let j=0;j<Math.floor(nbBlocRow/2);j++){
        d3.selectAll("rect[col='"+String(i)+"'][row='"+String(j)+"']")
        .attr('transform','translate('+String(bigGap*i)+','+String(bigGap*j)+')');
      }
      for (let j=Math.floor(nbBlocRow/2);j<nbBlocRow;j++){
        d3.selectAll("rect[col='"+String(i)+"'][row='"+String(j)+"']")
        .attr('transform','translate('+String(bigGap*i)+','+String(alleyGap+bigGap*j)+')');
      }
    
    } 
  }

}
