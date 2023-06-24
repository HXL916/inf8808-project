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
  data!:{ [key: string]: any}[];

  constructor(private leg:Legend, private preprocessingService: PreprocessingService) {}

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { // utiliser (data)=> permet de garder le .this qui référence le Tab1Component
      // WAFFLE CHART
      // Preprocess
      let dataWaffle = this.preprocessingService.dataWaffle
      let parties:string[] = this.preprocessingService.parties
      // Viz
      waffle.drawSquares(dataWaffle, '#waffleContainer', partyColorScale, 'Parti');
      this.drawWaffleLegend(parties)

    
      
      // BAR CHART
      // Preprocess
      let popularInterventions:{ [key: string]: any }[] = this.preprocessingService.popularInterventions
      console.log("ici", popularInterventions)
      this.createStackedBarChart(popularInterventions)


      // get the interventions for the current legislature (44)
      let recentInterventions = this.preprocessingService.recentInterventions

      // KEY VALUES with deputesLegislatures.csv + TOP & FLOP
      d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (listeDeputes) => {
        const listeDeputes44:{ [key: string]: any }[] = this.preprocessingService.listeDeputes44
        // preprocessing for top & flop
        let interestingMPs = this.preprocessingService.interestingMPs
        this.topMPs = interestingMPs["topMPs"]
        this.flopMPs = interestingMPs["flopMPs"]
        this.preprocessingService.getInterestingMPs(listeDeputes44, recentInterventions)
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

  

  drawWaffleLegend(parties:string[]):void{
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



    createStackedBarChart (popularinterventions: { [key: string]: any }[]): void {

  
      const margin = { top: 10, right:0, bottom: 10, left: 30 };
  
      const width = 1000 - margin.left - margin.right;
      const height = 150 - margin.top - margin.bottom;
  
      const svg = d3.select('#stackedBarChart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);


      let xMax:number = 0;
      for (const obj of popularinterventions) {
        xMax += obj["Count"];
      }
      let cumulative_count:number = 0
      popularinterventions.forEach((d) => {
          d["Beginning"] = cumulative_count;
          cumulative_count = cumulative_count + d["Count"]
          d["End"] = cumulative_count;
          d["Percentage"] = Math.round(d["Count"] / xMax * 1000)/10
        });
  
      const types: string[] = popularinterventions.map((obj) => obj["TypeIntervention"]);
      const x = d3.scaleLinear()
          .domain([0, xMax])
          .range([0, width]);
  
  
      const colores: any = d3.scaleOrdinal()
          .domain(types)
          .range(d3.schemeTableau10);



      console.log("Popular interventions", popularinterventions)

      const stack = svg.selectAll('.stack')
        .data(popularinterventions)
        .enter()
        .append('g')
        .attr('class', 'stack')
        .attr('transform', (d) => `translate(${x(d["Beginning"])}, 0)`);

      stack
        .append('rect')
        .attr('x', 0)
        .attr('width', (d) => x(d[1]) - x(d[0]))
        .attr('width', function(d) { console.log("d:",d) ; return x(d["End"] - d["Beginning"])})
        .attr('height', height)
        .attr('fill', function(d) { return colores(d["TypeIntervention"])});

      //Ajoute type d'interventions
      stack
        .append('text')
        .attr('x', (d) => x(d["End"] - d["Beginning"])/2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr("fill", "white")
        .attr("font-size", "1.3em")
        .attr("font-weight", "bold")
        .text((d) => d["TypeIntervention"]);

      //Ajoute pourcentage d'interventions
      stack
        .append('text')
        .attr('x', (d) => x(d["End"] - d["Beginning"])/2)
        .attr('y', height - 20)
        .attr('text-anchor', 'middle')
        .attr("fill", "white")
        .text((d) => d["Percentage"]+"%");

  }
}



