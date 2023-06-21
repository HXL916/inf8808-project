import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as preproc from './preprocessTab1'
import { Legend } from "../../utils/legend";
import { partyColorScale } from "../../utils/scales"
//import * as d3Legend from 'd3-svg-legend'


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.css']
})
export class Tab1Component implements AfterViewInit  {
  itemList!: any;
  color!: any;

  constructor(private leg:Legend) {}

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { // utiliser (data)=> permet de garder le .this qui référence le Tab1Component
      console.log(data)
      let parties:string[] = preproc.getPartiesNames(data)
      console.log(parties)
      let nbInterventionsByParty:{ [key: string]: any }[] = preproc.getPartyCounts(data)
      console.log(nbInterventionsByParty)

      this.createGraph(nbInterventionsByParty, parties)

      //drawLegend.drawLegend(partyColorScale, 400, parties)
      //this.drawLegend(parties)
    })
  }

  createGraph (data: { [key: string]: any }[], parties:string[]): void {
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
    // Add one dot in the legend for each name.
    
    // var legend = d3
    // .select('#legendContainer')
    // .append('svg')
    // .attr('width', 900)
    // .attr('height', 1000)
    // .selectAll('.legend-element')
    // .data(parties);
    // legend
    //   .enter()
    //   .append("rect")
    //     .attr("x", 100)
    //     .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    //     .attr("width", size)
    //     .attr("height", size)
    //     //.attr("fill",function(d){ return color(d)})
    //     .attr('fill', d=>this.color(d))

    // legend
    // .enter()
    // .append("text")
    //   .attr("x", 100 + size*1.2)
    //   .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    //   .style("fill", "black")
    //   .text(parties=>parties)
    //   .attr("text-anchor", "left")
    //   .style("alignment-baseline", "middle")
    //   }
    /*
    var container = d3.select("#waffleChart")
    container.append('g')
      .attr('class', 'legend')
      //.attr('transform', 'translate(' + width + ',-20)') 

    console.log(partyColorScale)

    var legend = d3Legend.legendColor()
      .shape('path', d3.symbol().type(d3.symbolSquare).size(250)()!) // mettre point d'exclamation à la fin parce qu'on sait que c'est non null
      .title('Legend')
      .shapePadding(5)
      .cells(6)
      .orient('vertical')
      .scale(partyColorScale)  as any

      container.select('.legend')
        .call(legend)
    */
  }
}


