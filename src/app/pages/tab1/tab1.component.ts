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

  constructor(private leg:Legend) {}

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { // utiliser (data)=> permet de garder le .this qui référence le Tab1Component
      console.log(data)
      let parties:string[] = preproc.getPartiesNames(data)
      console.log(parties)
      let nbInterventionsByParty:{ [key: string]: any }[] = preproc.getPartyCounts(data)
      console.log(nbInterventionsByParty)

      let nbInterventionsByType:{ [key: string]: any }[] = preproc.getTypeInterventionCounts(data)
      let popularInterventions:{ [key: string]: any }[] = preproc.getPopularInterventionTypes(nbInterventionsByType)

      let recentInterventions = preproc.getInterventionsLegislature(data, "44-1")
      console.log(recentInterventions)
      this.createGraph(nbInterventionsByParty, parties)


      //drawLegend.drawLegend(partyColorScale, 400, parties)
      this.drawLegend(parties)


      d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (listeDeputes) => {
        const listeDeputes44:{ [key: string]: any }[] = preproc.getMPsLegislature(listeDeputes, "44")

        preproc.getInterstingMPs(listeDeputes44, recentInterventions)

        const listeDeputes43:{ [key: string]: any }[] = preproc.getMPsLegislature(listeDeputes, "43")
        const increaseWomen:string = preproc.getIncreaseWomen(listeDeputes43, listeDeputes44) 
        console.log(increaseWomen)
        const statSpan3: HTMLSpanElement | null = document.getElementById("stat3") as HTMLSpanElement;
        if (statSpan3) {
          // Inject the value into the <span> element
          statSpan3.textContent = increaseWomen;
        }
      })
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


