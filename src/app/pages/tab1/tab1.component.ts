import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as preproc from './preprocessTab1'
import { Legend } from "../../utils/legend";

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.css']
})
export class Tab1Component implements AfterViewInit  {
  itemList!: any;
  data!: any;
  color!: any;

  constructor(private leg:Legend) {}

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { // utiliser (data)=> permet de garder le .this qui référence le Tab1Component
      console.log(data)
      let parties:string[] = preproc.getPartiesNames(data)
      console.log(parties)
      let nbInterventionsByParty:{ [key: string]: number } = preproc.getPartyCounts(data)
      console.log(nbInterventionsByParty)
      this.color;
      this.createGraph(nbInterventionsByParty, parties)
      this.drawLegend(parties)
    })
  }

  createGraph (data: any, parties:any): void {
    // Get the graph container element
    const container = d3.select('#waffleChart');

    // Define your graph logic using D3.js methods
    // For example, create a simple SVG circle

    console.log(data)
    console.log(parties)
    d3.select('#waffleChart').selectAll('.tile')
      .data(data)
      .enter()
      .append('rect')
      .attr('class','tile')
  }
  drawLegend(parties:string[]):void{
    console.log(parties)
    // Usually you have a color scale in your chart already
//this.color = d3.scaleOrdinal().range(d3.schemeTableau10).domain(parties);  
this.color=this.leg.scaleColor(parties)
console.log(this.color)
  // Add one dot in the legend for each name.
var size = 20
var legend = d3
    .select('#legendContainer')
    .append('svg')
    .attr('width', 900)
    .attr('height', 1000)
    .selectAll('.legend-element')
    .data(parties);
legend
  .enter()
  .append("rect")
    .attr("x", 100)
    .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    //.attr("fill",function(d){ return color(d)})
    .attr('fill', d=>this.color(d))

legend
.enter()
.append("text")
  .attr("x", 100 + size*1.2)
  .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
  .style("fill", "black")
  .text(parties=>parties)
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
  }
}
  // This function is just an example of how you can process your data
// process(data:any):number{
//   console.log(data);
//   return data;
// }

