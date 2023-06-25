import { Component, AfterViewInit } from '@angular/core';
import { Legend } from './../../utils/legend';
import { genderColorScale, partyColorScale } from "../../utils/scales"
import * as d3 from 'd3';
import * as waffle1 from 'src/app/pages/tab1/waffle';
import * as preprocessTab3 from 'src/app/pages/tab3/preprocessTab3';
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
  data:any;

  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey='genre';
  }

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => {
      this.data = preprocessTab3.getTypeInterventionCountsOfOneMonth(data,6,2015,this.wantedKey);     
      console.log(this.data);
      this.createStackedBar(this.process(this.data));
      waffle1.drawWaffleLegend(this.colorScale);
    })
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    this.updateView();
  }
  updateView():void{         //importer data une fois seulement à place de le refaire à chaque changement  
    this.process(this.data);
    waffle1.drawWaffleLegend(this.colorScale);
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

    return data.sort((x, y) => d3.ascending(x[this.wantedKey], y[this.wantedKey]));;
  }

  createStackedBar (data: { [key: string]: any }[]): void{
    

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 600- margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#zone-chart")
    .append("svg")
    .attr("id","stackedBarChart")
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = preprocessTab3.getCategories(data,this.wantedKey);

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    // var groups = preprocessTab3.getCategories(data, 'Mois');
    var groups = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];

    // Add X axis
    var xScale = d3.scaleBand().domain(groups).range([0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickSizeOuter(0));
    //console.log(xScale(6));

    // Add Y axis
    var yScale = d3.scaleLinear().domain([0, 10000]).range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack().keys(subgroups)(data)
    console.log(stackedData)


    // // Show the bars
    // svg.append("g")
    // .selectAll("g")
    // // Enter in the stack data = loop key per key = group per group
    // .data(stackedData)
    // .enter().append("g")
    //   .attr("fill", (d)=>this.colorScale(d.key))
    //   .selectAll("rect")
    //   // enter a second time = loop subgroup per subgroup to add all rectangles
    //   .data(function(d) { return d; })
    //   .enter()
    //     .append("rect")
    //     .attr("x", (d)=>x(d.data.group))
    //     .attr("y", function(d) { return y(d[1]); })
    //     .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    //     .attr("width",x.bandwidth());
    
    // var sel = d3.select("#zone-chart")
    //             .select('g')
    //             .selectAll('g.series')
    //             .data(stackedData)
    //             .join('g')
    //             .classed('series', true)
    //             .style('fill', (d) => this.colorScale(d.key));
    // sel.selectAll('rect')
    //   .data((d) => d)
    //   .join('rect')
    //   .attr('width', 40)
    //   .attr('y', (d) => yScale(d[1]))
    //   //.attr('x', (d) => xScale(d.data['Mois']) - 20)
    //   //.attr('x', (d) => xScale(6))
    //   .attr('height', (d) => yScale(d[0]) -  yScale(d[1]));
    }





  // createStackedBar (interventionsList: { [key: string]: any }[]): void {
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

