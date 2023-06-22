import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as preproc from './preprocessTab1'
import { Legend } from "../../utils/legend";
import { partyColorScale } from "../../utils/scales"
import * as d3Legend from 'd3-svg-legend'


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.css']
})
export class Tab1Component implements AfterViewInit  {
  itemList!: any;
  color!: any;
  xScale!: any;
  yScale!: any;

  constructor(private leg:Legend) {}

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { // utiliser (data)=> permet de garder le .this qui référence le Tab1Component
      console.log(data)
      let parties:string[] = preproc.getPartiesNames(data)
      console.log(parties)
      let nbInterventionsByParty:{ [key: string]: any }[] = preproc.getPartyCounts(data)
      console.log(nbInterventionsByParty)

      let nbInterventionsByType:{ [key: string]: any }[] = preproc.getTypeInterventionCounts(data)
      console.log(nbInterventionsByType)

      this.createGraph(nbInterventionsByParty, nbInterventionsByType, parties)
      this.yScale;
      this.xScale;

      //drawLegend.drawLegend(partyColorScale, 400, parties)
      this.drawLegend(parties)
    })
  }

  createGraph (data: { [key: string]: any }[], nbint: { [key: string]: any }[], parties:string[]): void {
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

    const margin = { top: 10, right: 10, bottom: 20, left: 40 };

    const width = 300 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;
    var total=nbint.reduce((total,arg)=>total+arg['Count'],0);
    

    const svgbar=d3.select('#stackedBarChart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    this.xScale = d3.scaleLinear()
    .domain([0, d3.max(nbint, d => d['Count'])])
    .range([0, width]);
    console.log(d3.max(nbint, d => d['Count']))
  
    this.yScale = d3.scaleBand()
      .domain(nbint.map(d => d['Parti']))
      .range([0, height])
      .padding(0.1);

    // Create and append the bars
    svgbar.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => this.yScale(d['Count']))
      .attr("width", d => this.xScale(d['Parti']))
      .attr("height", this.yScale.bandwidth());

    // Add x-axis
    svgbar.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(this.xScale));

    // Add y-axis
    svgbar.append("g")
      .call(d3.axisLeft(this.yScale));

  }

  

  drawLegend(parties:string[]):void{
    console.log(parties)
    // Usually you have a color scale in your chart already
    //this.color = d3.scaleOrdinal().range(d3.schemeTableau10).domain(parties);  
    this.color= partyColorScale
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


