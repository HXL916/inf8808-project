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
      let donnees:{ [key: string]: any }={nom:'Type'};
      let arDonnees:{ [key: string]: any}[]=[];
      popularinterventions.forEach(nb=>{
        let newkey:string=Object.values(nb)[0];
        donnees[newkey] = Object.values(nb)[1] ;
      })
      arDonnees.push(donnees)
  
      const margin = { top: 10, right:0, bottom: 10, left: 30 };
  
      const width = 1000 - margin.left - margin.right;
      const height = 150 - margin.top - margin.bottom;
  
      const svg = d3.select('#stackedBarChart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

  
      const fruit = Object.keys(arDonnees[0]).filter(d => d != "nom");
      console.log("fruit")
      console.log(fruit);
      const months = arDonnees.map(d => d["nom"]);
      console.log(months);
      const stackedData = d3.stack()
          .keys(fruit)(arDonnees);
  
      const xMax: any = d3.max(stackedData[stackedData.length - 1], d => d[1]);
      console.log("xmax:", xMax)
      // scales
  
  
      const x = d3.scaleLinear()
          .domain([0, xMax])
          .range([0, width]);
  
      const y = d3.scaleBand()
          .domain(months)
          .range([0, height])
  
      const colores: any = d3.scaleOrdinal()
          .domain(fruit)
          .range(d3.schemeTableau10);

      const layers = svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
        .attr('fill', d => colores(d.key));



      layers.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("height", y.bandwidth())
        .attr("width", function(d) { console.log(d)
          console.log(x(d[1]))
          return x(d[1]) - x(d[0]) });
  }
}



