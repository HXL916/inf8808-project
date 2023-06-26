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
  height!:number;

  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey='genre';
  }

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => {
      const filterData = preprocessTab3.getInterventionsByDateRange(data, "01/01/2016", "06/30/2016") //saloperie de format américain
      console.log(filterData)
      const groupedArrays = preprocessTab3.groupInterventionByMonth(filterData)
      let Ymax = preprocessTab3.getMaxCharCounts(groupedArrays)
      console.log("Ymax", Ymax)
      const something = preprocessTab3.getCountsWithKey(groupedArrays["2016-1"], "parti")
      console.log("something",something)
      const timeGroups = Object.keys(groupedArrays)
      console.log("time groups", timeGroups)
      
      this.createGraphBase(timeGroups, Ymax)
      this.wantedKey = "parti"
      this.colorScale = partyColorScale
      this.generateBarChart(groupedArrays)

      // Idee: reprendre le principe du bar chart du tab 1 pour chaque élément dans groupedArrays
      // Genre applere une fonction addBarOneMonth(groupedArray[month], month)
      // Y a juste besoin du groupedArray[month] (avec un peu de processing derrière) pour créer la barre
      // et month permet de positionner sur l'axe des abscisses 


      // this.data = preprocessTab3.getTypeInterventionCountsOfOneMonth(data,6,2015,this.wantedKey);     
      // console.log("thisdata:")
      // console.log(this.data);
      // this.createStackedBar(this.process(this.data));
      //waffle1.drawWaffleLegend(this.colorScale);
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

    return data;
  }

  // crée la base du graph: svg element, axes, titre?
  createGraphBase(timeGroups: string[], Ymax:number) : void{
    var margin = {top: 10, right: 30, bottom: 20, left: 90},
    width = 900- margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    this.height = height

    // append the svg object to the body of the page
    var svg = d3.select("#zone-chart")
    .append("svg")
    .attr("id","stackedBarChart")
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    this.xScale = d3.scaleBand().domain(timeGroups).range([0, width]).paddingInner(0.6);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(this.xScale).tickSizeOuter(0));

    this.yScale = d3.scaleLinear().domain([0, Ymax]).range([ 0, height]);
      svg.append("g")
      .call(d3.axisLeft(this.yScale));
  
  }    

    generateBarChart(groupedArrays:any):void{
      for (const key in groupedArrays) {
        console.log(this.xScale(key))
        this.generateOneBar(groupedArrays[key], key)
      }
    }

    generateOneBar(interventionData: { [key: string]: any }[], xvalue:any):void{
      let tab:{ [key: string]: any }[] = preprocessTab3.getCountsWithKey(interventionData, this.wantedKey)
      preprocessTab3.transformWithCumulativeCount(tab)
      console.log("tab:",tab)
      // on affecte a des variables locales à la fonction parce que this. dans les fonctions qu'on appelle avec d3 perd la référence au composant
      let xScale = this.xScale
      let yScale = this.yScale
      let colorScale = this.colorScale
      let height = this.height

      // on crée un groupe stackedBar par moi, on stack le intervention de ce mois dans ce groupe
      // on positionne le groupe sur l'axe des abscisses
      const container = d3.select("#stackedBarChart")
        .select("g")
        .append("g")
        .attr("class", "stackedBar")
        .attr("width", 35) // a changer
        .attr("transform", `translate(${xScale(xvalue)},0)`)

      // crée toutes les zones (une par KeyElement) pour cette barre
      const stack = container.selectAll('.stack')
        .data(tab)
        .enter()
        .append('g')
        .attr('class', 'stack')
        //.attr('transform', (d) => `translate(0,${height - yScale(d["Beginning"])})`)

      console.log("yScale(1000000)", yScale(1000000))
      console.log("yScale(5000000)", yScale(5000000))

      // ajoute le rectangle à chaque zone
      stack
        .append('rect')
        .attr('x', 0)
        .attr('height', function(d) { return yScale(d["End"] - d["Beginning"])})
        .attr("y", function(d) {  return height - yScale(d["End"])})
        .attr('width', xScale.bandwidth())
        .attr('fill', function(d) { return colorScale(d["KeyElement"])});
    }

}

