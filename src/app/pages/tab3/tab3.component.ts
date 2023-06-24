import { Legend } from './../../utils/legend';
import { Component, AfterViewInit } from '@angular/core';
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
  data!:any;

  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey='genre';
  }

  ngAfterViewInit(): void {d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (data)=>{ 
    this.data=data;    
    this.createGraph(this.process(data));
  });
  }

  createGraph(data:any): void {
    
    waffle1.drawWaffleLegend(this.colorScale);
    
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    this.updateView();
  }
  updateView():void{         //importer data une fois seulment à place de le refaire à chaque changement
    this.createGraph(this.process(this.data));
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
        //let affiliations = this.preprocessingService.getPartiesNames(data);
        this.colorScale = partyColorScale//d3.scaleOrdinal().domain(affiliations).range(["#159CE1","#AAAAAA","#FF8514","#002395","#ED2E38","#30D506"]);
        break;
      case "province":
        let provinces = data.map(obj => obj["province"]).sort();
        this.colorScale = d3.scaleOrdinal().domain(provinces).range(d3.schemeTableau10);
        break;
    } 

    return data.sort((x, y) => d3.ascending(x[this.wantedKey], y[this.wantedKey]));

//   itemList!: any;
//   color!: any;
//   xScale!: any;
//   yScale!: any;
//   pourcent!: any;
//   colorScale!: any;
//   wantedKey:string;

//   constructor(private preprocessingService: PreprocessingService, private legend: Legend) {
//     this.wantedKey = 'genre'
//   }

//   ngAfterViewInit(): void {
//     d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { 
//       let parties:string[] = ["Homme", "Femme"];
//       console.log("party ", parties);
//       console.log("data ", data);

//       this.drawLegend(parties);      

      
//       let nbInterventionsByType:{ [key: string]: any }[] = this.preprocessingService
//       .getTypeInterventionCountsByPeriod(data, 2015, 6, 'genre')      
//       this.createStackedBar(nbInterventionsByType)
//       console.log("nbinterByType ", nbInterventionsByType)
//     })
//   }

//   createStackedBar (popularinterventions: { [key: string]: any }[]): void {
//     const margin = { top: 10, right:0, bottom: 10, left: 30 };

//     const width = 150 - margin.left - margin.right;
//     const height = 1400 - margin.top - margin.bottom;

//     const genres = popularinterventions;

//     const colores: any = genderColorScale;
//     const months = genres.map(d => d["genre"]);

//     var xScale = d3.scaleBand()
//       .domain(months)
//       .range([0, height])

//             let donnees:{ [key: string]: any }={nom:'Genre'};
//       let arDonnees:{ [key: string]: any}[]=[];
//       popularinterventions.forEach(nb=>{
//         let newkey:string=Object.values(nb)[0];
//         donnees[newkey] = Object.values(nb)[1];
//       })
//       arDonnees.push(donnees)
//       const fruit = Object.keys(arDonnees[0]).filter(d => d != "plumes");

//       const stackedData = d3.stack()
//         .keys(fruit)(arDonnees);

//       const xMax: any = d3.max(stackedData[stackedData.length - 1], d => d[1]);

//       const yScale = d3.scaleLinear()
//       .domain([0, xMax])
//       .range([0, height]);

//       var yAxis = d3.axisLeft(yScale)
//         .scale(yScale)
//         .ticks(6);

//       var stack = d3.stack()
//         .keys(fruit)
//         .order(d3.stackOrderAscending);

//       var series = stack(genres);

//       const svg = d3.select('#stackedBarChart')
//         .attr('width', width + margin.left + margin.right)
//         .attr('height', height + margin.top + margin.bottom)
//         .append('g')
//         .attr('transform', `translate(${margin.left},${margin.top})`);

//         const layers = svg.append('g')
//         .selectAll('g')
//         .data(stackedData)
//         .join('g')
//           .attr('fill', d => colores(d.key));

//       //---------------------------------------------
//       layers.selectAll("rect")
//       .data(function(d) { return d; })
//       .enter()
//       .append("rect")
//       // .attr("x", function(d) { return xScale(d[2]); })
//       .attr("y", function(d) { return yScale(d[0]); })
//       .attr("width", xScale.bandwidth())
//       .attr("height", function(d) { console.log(d)
//         console.log(yScale(d[1]))
//         return yScale(d[1]) - yScale(d[0]) });
//   }

//   createStackedBarChart (popularinterventions: { [key: string]: any }[]): void {
//     let donnees:{ [key: string]: any }={nom:'Type'};
//     let arDonnees:{ [key: string]: any}[]=[];
//     popularinterventions.forEach(nb=>{
//       let newkey:string=Object.values(nb)[0];
//       donnees[newkey] = Object.values(nb)[1];
//     })
//     arDonnees.push(donnees)
//     console.log("ArDonnees ", popularinterventions);

//     const margin = { top: 10, right:0, bottom: 10, left: 30 };

//     const width = 150 - margin.left - margin.right;
//     const height = 1000 - margin.top - margin.bottom;

    

//     const svg = d3.select('#stackedBarChart')
//         .attr('width', width + margin.left + margin.right)
//         .attr('height', height + margin.top + margin.bottom)
//         .append('g')
//         .attr('transform', `translate(${margin.left},${margin.top})`);

//     const fruit = Object.keys(arDonnees[0]).filter(d => d != "nom");
//     console.log("fruit")
//     console.log(fruit);
//     const months = arDonnees.map(d => d["année"]);
//     console.log("ardonneeee", arDonnees);
//     const stackedData = d3.stack()
//         .keys(fruit)(arDonnees);

//     const xMax: any = d3.max(stackedData[stackedData.length - 1], d => d[1]);
//     // scales

//     console.log('months ', months)

//     const x = d3.scaleBand()
//     .domain(months)
//     .range([0, height])

//     const y = d3.scaleLinear()
//       .domain([0, xMax])
//       .range([0, height]);

//     const colores: any = d3.scaleOrdinal().domain(["H","F"]).range(["#50BEB8","#772A93"]);

//     const layers = svg.append('g')
//     .selectAll('g')
//     .data(stackedData)
//     .join('g')
//       .attr('fill', d => colores(d.key));



//     layers.selectAll("rect")
//       .data(function(d) { return d; })
//       .enter()
//       .append("rect")
//       .attr("y", function(d) { return y(d[0]); })
//       .attr("height", x.bandwidth())
//       .attr("width", function(d) { console.log(d)
//         console.log(y(d[1]))
//         return y(d[1]) - y(d[0]) });
// }

//   updateWantedKey(key:string):void{
//     this.wantedKey=key;
//     this.updateView();
//   }

//   updateView():void{
//     // 
//   }

//   /**
//    * Keeps only the MPs from the selected Legislature.
//    *
//    * @param {object[]} data The data to analyze
//    * @returns {object[]} output The data filtered
//    */
//   process(data: { [key: string]: any }[]):{ [key: string]: any }[]{
//     switch (this.wantedKey){
//       case "genre":
//         this.colorScale = d3.scaleOrdinal().domain(["H","F"]).range(["#50BEB8","#772A93"]);
//         break;
//       case "parti":
//         let affiliations = this.preprocessingService.getPartiesNames(data);
//         this.colorScale = d3.scaleOrdinal().domain(affiliations).range(["#159CE1","#AAAAAA","#FF8514","#002395","#ED2E38","#30D506"]);
//         break;
//       case "province":
//         let provinces = data.map(obj => obj["province"]).sort();
//         this.colorScale = d3.scaleOrdinal().domain(provinces).range(d3.schemeTableau10);
//         break;
//     } 

//     return data.sort((x, y) => d3.ascending(x[this.wantedKey], y[this.wantedKey]));
//   }

//   // will change this to have adapting legend
//   drawLegend(parties:string[]):void{
//     console.log(parties)
//     this.color= d3.scaleOrdinal().domain(["H","F"]).range(["#50BEB8","#772A93"]);
//     console.log(this.color)
//       // Add one dot in the legend for each name.
//     var size = 20
//     var legend = d3
//         .select('#legendContainer')
//         .append('svg')
//         .attr('width', 200)
//         .attr('height', 300)
//         .selectAll('.legend-element')
//         .data(parties);
//     legend
//       .enter()
//       .append("rect")
//         .attr("x", 100)
//         .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .attr("width", size)
//         .attr("height", size)
//         //.attr("fill",function(d){ return color(d)})
//         .attr('fill', d=>this.color(d))

//     legend
//     .enter()
//     .append("text")
//       .attr("x", 100 + size*1.2)
//       .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//       .style("fill", "black")
//       .text(parties=>parties)
//       .attr("text-anchor", "left")
//       .style("alignment-baseline", "middle")
//     }
}

