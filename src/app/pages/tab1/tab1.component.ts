import { Component, AfterViewInit, ViewEncapsulation  } from '@angular/core';
import * as d3 from 'd3';
import { Legend } from "../../utils/legend";
import { partyColorScale } from "../../utils/scales"
import * as d3Legend from 'd3-svg-legend'
import * as waffle from 'src/app/utils/waffle';
import { PreprocessingService } from 'src/app/services/preprocessing.service';


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class Tab1Component implements AfterViewInit  {
  itemList!: any;
  color!: any;
  xScale!: any;
  yScale!: any;
  pourcent!: any;
  topMPs!: {}[]
  flopMPs!: {}[]

  constructor(private leg:Legend, private preprocessingService: PreprocessingService) {}

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { // utiliser (data)=> permet de garder le .this qui référence le Tab1Component
      // WAFFLE CHART
      // Preprocess
      let nbInterventionsByParty:{ [key: string]: any }[] = this.preprocessingService.nbInterventionsByParty
      let dataWaffle = this.preprocessingService.dataWaffle
      let parties:string[] = this.preprocessingService.parties
      // Viz
      waffle.drawSquares(dataWaffle, '#waffleContainer',partyColorScale,'Parti');
      this.drawLegend(parties);
      
      // BAR CHART
      // Preprocess

      // Viz


      // KEY VALUES
      // Preprocess

      // Viz


      // TOP FLOP
      // Preprocess

      // Viz

      
      
      
      
      
      
      let nbInterventionsByType:{ [key: string]: any }[] = this.preprocessingService.nbInterventionsByParty


      this.createGraph(nbInterventionsByParty, nbInterventionsByType, parties)
      this.yScale;
      this.xScale;
      this.pourcent;

      let popularInterventions:{ [key: string]: any }[] = this.preprocessingService.popularInterventions

      let recentInterventions = this.preprocessingService.recentInterventions

      //this.createGraph(nbInterventionsByParty, parties)



      //drawLegend.drawLegend(partyColorScale, 400, parties)
      

      // KEY VALUES with deputesLegislatures.csv + TOP & FLOP
      d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (listeDeputes) => {
        const listeDeputes44:{ [key: string]: any }[] = this.preprocessingService.listeDeputes44
        // preprocessing for top & flop
        let interestingMPs = this.preprocessingService.interestingMPs
        this.topMPs = interestingMPs["topMPs"]
        this.flopMPs = interestingMPs["flopMPs"]
        // prepcoessing for Key value: increase in number of women
        const listeDeputes43:{ [key: string]: any }[] = this.preprocessingService.listeDeputes43
        const increaseWomen:string = this.preprocessingService.increaseWomen
        console.log(increaseWomen)
        const statSpan3: HTMLSpanElement | null = document.getElementById("stat3") as HTMLSpanElement;
        if (statSpan3) {
          // Inject the value into the <span> element
          statSpan3.textContent = increaseWomen;
        }
      })

      // KEY VALUES with listedeputes.csv : number of changes since beginning legislature
      d3.csv('./assets/data/listedeputes.csv', d3.autoType).then( (listeDeputes) => {
        console.log("allo")
        const changesLegislature44 : { [key: string]: any }[] = this.preprocessingService.changesLegislature44
        const statSpan2: HTMLSpanElement | null = document.getElementById("stat2") as HTMLSpanElement;
        if (statSpan2) {
          const innerStatSpan: HTMLSpanElement = document.createElement("span");
          innerStatSpan.classList.add("statValue");
          if(changesLegislature44.length == 0){
            innerStatSpan.textContent = "Aucun"
            const textAfter: Text = document.createTextNode(" député n'a")
            statSpan2.appendChild(innerStatSpan)
            statSpan2.appendChild(textAfter)
          }
          else if(changesLegislature44.length == 1){
            innerStatSpan.textContent = "1"
            const textAfter: Text = document.createTextNode("députe ("+changesLegislature44[0]["nom"]+") a")
            statSpan2.appendChild(innerStatSpan)
            statSpan2.appendChild(textAfter)
          }
          else{
            //statSpan2.textContent = changesLegislature44.length.toString()+" députés ont";
            innerStatSpan.textContent = changesLegislature44.length.toString()
            const textAfter: Text = document.createTextNode(" députés ont")
            statSpan2.appendChild(innerStatSpan)
            statSpan2.appendChild(textAfter)
          }
        }
      })
    })
  }

  createGraph (data: { [key: string]: any }[], nbint: { [key: string]: any }[], parties:string[]): void {
    // Define your graph logic using D3.js methods
    // For example, create a simple SVG circle
    this.color= partyColorScale
    console.log(data)
    console.log(parties)
    d3.select('#waffleChart').selectAll('.tile')
      .data(data)
      .enter()
      .append('rect')
      .attr('class','tile')

    const margin = { top: 10, right: 10, bottom: 20, left: 40 };

    const width = 350 - margin.left - margin.right;
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
    console.log(d3.max(nbint, d => d['Count']/total*100))
  
    this.yScale = d3.scaleBand()
      .domain(nbint.map(d => d['Parti']))
      .range([0, height]);

    // Create and append the bars
    svgbar.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr('x', d => this.xScale(d['Count']))
      .attr('y', d => this.yScale(d['Parti']))
      .attr("width", d => this.xScale(d['Count']))
      .attr("height", this.yScale.bandwidth())
      .attr('fill', d=>this.color(d['Parti']));


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


