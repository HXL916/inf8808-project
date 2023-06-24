import { Component, AfterViewInit} from '@angular/core';
import * as d3 from 'd3';
import * as d3Legend from 'd3-svg-legend';
import * as waffle from 'src/app/utils/waffle';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import { partyColorScale } from "../../utils/scales"


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css']
})
export class Tab2Component  implements AfterViewInit   {
  colorScale!: any;
  wantedKey:string;
  wantedLegislature:number;
  sortedData:any;
  
  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey = "genre";
    this.wantedLegislature = 44;
  }

  ngAfterViewInit(): void {
    d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (data)=>{     
      this.sortedData = this.preprocessingService.splitByLegislature(data);
      console.log(this.sortedData);
      console.log(this.preprocessingService.getPartiesNames(data));
      this.createGraph(this.process(this.sortedData[this.wantedLegislature]));
    });
    
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    this.updateView();
  }
  updateWantedLegislature(event: Event) {
    this.wantedLegislature=Number((event.target as HTMLInputElement).value);
    this.updateView();
  }
  updateView():void{         //importer data une fois seulment à place de le refaire à chaque changement
    this.createGraph(this.process(this.sortedData[this.wantedLegislature]));
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


/**
 * Draws the waffle chart
 *
 * @param {object[]} data The data to use
 */
  createGraph(data: { [key: string]: any }[]): void {
    /*
    var tooltip = d3.select("#tooltip")
                    .append('div')
                      .style("opacity", 0)
                      .attr("class", "tooltip")
                      .style("background-color", "#8AB476")
                      .style("border-radius", "25px")
                      .style("padding", "20px");*/
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

  /**
 * Rearrange the waffle chart to git it the looks of the House Of Commons, with an alley in the middle
 */
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


  drawLegend():void{    //TODO : utilise preprocess.getPartiesNames(data) pour avoir les noms des partis
  }

  
}
