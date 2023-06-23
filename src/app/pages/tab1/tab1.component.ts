import { Component, AfterViewInit, ViewEncapsulation  } from '@angular/core';
import * as d3 from 'd3';
import * as preproc from './preprocessTab1'
import { Legend } from "../../utils/legend";
import { partyColorScale } from "../../utils/scales"
import * as d3Legend from 'd3-svg-legend'
import * as waffle from 'src/app/utils/waffle';


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
  data!:{ [key: string]: any}[];

  constructor(private leg:Legend) {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { // utiliser (data)=> permet de garder le .this qui référence le Tab1Component
      // WAFFLE CHART
      // Preprocess
      let nbInterventionsByParty:{ [key: string]: any }[] = preproc.getPartyCounts(data)
      let dataWaffle = preproc.convertToWaffleCompatible(nbInterventionsByParty);
      let parties:string[] = preproc.getPartiesNames(data);
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

      
      
      
      
      
      
      let nbInterventionsByType:{ [key: string]: any }[] = preproc.getTypeInterventionCounts(data)


      this.createGraph(nbInterventionsByParty, nbInterventionsByType, parties)
      this.yScale;
      this.xScale;
      this.pourcent;

      let popularInterventions:{ [key: string]: any }[] = preproc.getPopularInterventionTypes(nbInterventionsByType)

      let recentInterventions = preproc.getInterventionsLegislature(data, "44-1")

      //this.createGraph(nbInterventionsByParty, parties)



      //drawLegend.drawLegend(partyColorScale, 400, parties)
      

      // KEY VALUES with deputesLegislatures.csv + TOP & FLOP
      d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (listeDeputes) => {
        const listeDeputes44:{ [key: string]: any }[] = preproc.getMPsLegislature(listeDeputes, "44")
        // preprocessing for top & flop
        preproc.getInterstingMPs(listeDeputes44, recentInterventions)
        // prepcoessing for Key value: increase in number of women
        const listeDeputes43:{ [key: string]: any }[] = preproc.getMPsLegislature(listeDeputes, "43")
        const increaseWomen:string = preproc.getIncreaseWomen(listeDeputes43, listeDeputes44) 
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
        const changesLegislature44 : { [key: string]: any }[] = preproc.getNbChangesLegislature(listeDeputes, "441")
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
  ngAfterViewInit(): void {
    
  }
  createGraph (nbpart: { [key: string]: any }[], nbint: { [key: string]: any }[], parties:string[]): void {



    // Define your graph logic using D3.js methods
    // For example, create a simple SVG circle
    this.color= partyColorScale
    
    d3.select('#waffleChart').selectAll('.tile')
      .data(nbpart)
      .enter()
      .append('rect')
      .attr('class','tile')
    //ancien code stacked bar

  
    // Nouveau code stacked bar
    let donnees:{ [key: string]: any }={nom:'Type'};
    let arDonnees:{ [key: string]: any}[]=[];
    nbint.forEach(nb=>{
      let newkey:string=Object.values(nb)[0];
      donnees[newkey] = Object.values(nb)[1] ;
    })
    arDonnees.push(donnees);
    console.log(arDonnees);

    const margin = { top: 10, right: 10, bottom: 20, left: 40 };

    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select('#stackedBarChart')
      //.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // data

    

    const fruit = Object.keys(arDonnees[0]).filter(d => d != "nom");
    console.log(fruit);
    const months = arDonnees.map(d => d["nom"]);
    console.log(months);
    const stackedData = d3.stack()
        .keys(fruit)(arDonnees);

    const xMax: any = d3.max(stackedData[stackedData.length - 1], d => d[1]);
    // scales


    const x = d3.scaleLinear()
        .domain([0, xMax]).nice()
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(months)
        .range([0, height])
        //.padding(0.75);

    const colores: any = d3.scaleOrdinal()
        .domain(fruit)
        .range(d3.schemeTableau10);

    // axes

    /*const xAxis = d3.axisBottom(x).ticks(5, '~s');
    const yAxis = d3.axisLeft(y);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .call(g => g.select('.domain').remove());

    svg.append("g")
        .call(yAxis)
        .call(g => g.select('.domain').remove());*/

    // draw bars

    // create one group for each fruit
    const layers = svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
        .attr('fill', d => colores(d.key));



    layers.selectAll("rect")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d) { return x(d[0]); })
    .attr("height", y.bandwidth())
    .attr("width", function(d) { return x(d[1]) - x(d[0]) });
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


