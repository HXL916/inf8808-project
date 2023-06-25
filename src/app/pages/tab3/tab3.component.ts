import { Component, AfterViewInit } from '@angular/core';
import { Legend } from './../../utils/legend';
import { genderColorScale, partyColorScale } from "../../utils/scales"
import * as d3 from 'd3';
import * as waffle1 from 'src/app/pages/tab1/waffle';
import { PreprocessingService } from 'src/app/services/preprocessing.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})
export class Tab3Component  implements AfterViewInit  {
  wantedKey:string;
  colorScale!: any;
  itemList!: any;
  color!: any;
  xScale!: any;
  yScale!: any;
  pourcent!: any;

  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey='genre';
  }

  ngAfterViewInit(): void {
    //waffle1.drawWaffleLegend(this.colorScale);

    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => {
      let nbInterventionsByType:{ [key: string]: any }[] = this.preprocessingService.getTypeInterventionCountsByPeriod(data);     
      console.log(nbInterventionsByType);
      //this.createStackedBar(nbInterventionsByType);
    })
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    this.updateView();
  }
  updateView():void{         //importer data une fois seulment à place de le refaire à chaque changement
    //this.createGraph(this.process(this.data));
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
        let affiliations = this.preprocessingService.getPartiesNames(data);
        this.colorScale = d3.scaleOrdinal().domain(affiliations).range(["#159CE1","#AAAAAA","#FF8514","#002395","#ED2E38","#30D506"]);
        break;
      case "province":
        let provinces = data.map(obj => obj["province"]).sort();
        this.colorScale = d3.scaleOrdinal().domain(provinces).range(d3.schemeTableau10);
        break;
    } 

    return data.sort((x, y) => d3.ascending(x[this.wantedKey], y[this.wantedKey]));
  }

  // createStackedBar (interventionList: { [key: string]: any }[]): void {
  //   const margin = { top: 10, right:0, bottom: 10, left: 30 };

  //   const width = 150 - margin.left - margin.right;
  //   const height = 900 - margin.top - margin.bottom;

  //   const svg = d3.select('#stackedBarChart')
  //         .attr('width', width + margin.left + margin.right)
  //         .attr('height', height + margin.top + margin.bottom)
  //         .append('g')
  //         .attr('transform', `translate(${margin.left},${margin.top})`);

  //   const genres = interventionList;

  //   console.log("genre: " + genres);

  //   const colores: any = genderColorScale;

  //   let yMaxi:number = 0;
  //     for (const obj of interventionList) {
  //       yMaxi += obj[0]["Count"] + obj[1]["Count"];
  //     }
  //     var xScale = d3.scaleLinear()
  //       .domain([0, 6])
  //       .range([0, height])
      
  //       const yScale = d3.scaleLinear()
  //       .domain([0, 2377])
  //       .range([0, height]);

  //     const xMax: any = 6;

  //     var yAxis = d3.axisLeft(yScale)
  //       .scale(yScale)
  //       .ticks(6);

  //       const stack = svg.selectAll('.stack')
  //       .data(interventionList)
  //       .enter()
  //       .append('g')
  //       .attr('class', 'stack')
  //       .attr('transform', (d) => `translate(${xScale(d[0])}, 0)`)
  //       .attr('transform', (d) => `translate(${yScale(d["Beginning"])}, 0)`)

  //       stack
  //       .append('rect')
  //       .attr('x', 0)
  //       .attr('y', 0)
  //       .attr('width', (d) => xScale(24))
  //       .attr('height', function(d) { 
  //         console.log('d dans stack ', d[0]['Count'])
  //         return yScale(d[0]['Count'] + d[1]['Count'])})
  //       .attr('fill', function(d) { console.log("colorScale ", colores);return colores[d[0]['Genre']]});
  // }

}

