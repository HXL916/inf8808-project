import { Component, AfterViewInit } from '@angular/core';
import { Legend } from './../../utils/legend';
import { genderColorScale, partyColorScale, provinceColorScale, translatePretty, translateDate } from "../../utils/scales"
import * as d3 from 'd3';
import * as waffle1 from 'src/app/pages/tab1/waffle';
import * as preprocessTab3 from 'src/app/pages/tab3/preprocessTab3';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})
export class Tab3Component  implements AfterViewInit  {
  wantedKey!:string;
  wantedDate!: FormGroup<{ start: FormControl<Date | null>; end: FormControl<Date | null>; }>;
  colorScale!: any;
  itemList!: any;
  color!: any;
  xScale!: any;
  yScale!: any;
  pourcent!: any;
  data:any;
  height!:number;
  tooltip:any;

  constructor(private preprocessingService: PreprocessingService) {
    this.updateWantedKey("genre");
    this.wantedDate = new FormGroup({start: new FormControl<Date | null>(new Date(2021, 10, 22)), end: new FormControl<Date | null>(new Date(2023, 0, 1))});
  }

  ngAfterViewInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => {
      this.data = data
      // 44ème législature
      const filterData = preprocessTab3.getInterventionsByDateRange(data, this.wantedDate.value.start!, this.wantedDate.value.end!)
      //console.log(filterData)
      const groupedArrays = preprocessTab3.groupInterventionByMonth(filterData)
      //console.log("groupedArrays", groupedArrays)
      let Ymax = preprocessTab3.getMaxCharCounts(groupedArrays)
      //console.log("Ymax", Ymax)
      const timeGroups = Object.keys(groupedArrays)
      //console.log("time groups", timeGroups)
      
      this.createGraphBase(timeGroups, Ymax)
      this.generateBarChart(groupedArrays)
      waffle1.drawWaffleLegend(this.colorScale)

      // Idee: reprendre le principe du bar chart du tab 1 pour chaque élément dans groupedArrays
      // Genre applere une fonction addBarOneMonth(groupedArray[month], month)
      // Y a juste besoin du groupedArray[month] (avec un peu de processing derrière) pour créer la barre
      // et month permet de positionner sur l'axe des abscisses 
    })
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    console.log(this.wantedKey)

    switch (this.wantedKey){
      case "genre":
        this.colorScale = genderColorScale;
        break;
      case "parti":
        this.colorScale = partyColorScale;
        break;
      case "province":
        this.colorScale = provinceColorScale;
        break;
    } 
    this.updateView();
  }
  updateView():void{         //importer data une fois seulement à place de le refaire à chaque changement  
    this.ngAfterViewInit();
  }

  // crée la base du graph: svg element, axes, titre?
  createGraphBase(timeGroups: string[], Ymax:number) : void{
    var margin = {top: 10, right: 30, bottom: 20, left: 90},
    width = 900- margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    this.height = height

    // delete any old stackedBarChart so clicking updates don't append new charts
    d3.selectAll("#stackedBarChart").remove();

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
    svg.append("g").call(d3.axisLeft(d3.scaleLinear().domain([0, Ymax]).range([ height,0])));

    this.tooltip = svg.append("g")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .html('TEST HERE')
  
  }    

    generateBarChart(groupedArrays:any):void{
      console.log("groupedArrays", groupedArrays)
      
      for (const key in groupedArrays) {                // here key = date YYYY-M (ex: 2016-1)
        this.generateOneBar(groupedArrays[key], key)
      }
    }

    generateOneBar(interventionData: { [key: string]: any }[], xvalue:any):void{
      let tab:{ [key: string]: any }[] = preprocessTab3.getCountsWithKey(interventionData, this.wantedKey)
      preprocessTab3.transformWithCumulativeCount(tab)
      console.log('tab',tab)

      // on affecte a des variables locales à la fonction parce que this. dans les fonctions qu'on appelle avec d3 perd la référence au composant
      let xScale = this.xScale
      let yScale = this.yScale
      let colorScale = this.colorScale
      let height = this.height
      let tooltip = this.tooltip
      let wantedKey = this.wantedKey
      let wantedDate = this.wantedDate

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

      // ajoute le rectangle à chaque zone
      stack
        .append('rect')
        .attr('x', 0)
        .attr('height', function(d) { return yScale(d["End"] - d["Beginning"])})
        .attr("y", function(d) {  return height - yScale(d["End"])})
        .attr('width', xScale.bandwidth())
        .attr('fill', function(d) { return colorScale(d["KeyElement"])})
        // Tooltip part
        .on("mouseover", function(event, d) {
          tooltip
            .style("opacity", 1)
            .style("left", (d3.pointer(event)[0]+70) + "px")
            .style("top", (d3.pointer(event)[1]) + "px")
            .html(translatePretty(d['KeyElement'])+" en "+translateDate(xvalue)+":<br> - "+d['Count']+" interventions <br> - "+d['CharCount']+" caractères dans ces interventions")
          d3.select(this)
            .style("stroke", "black")
        })
        .on("mouseleave", function(d) {
          tooltip.style("opacity", 0)
          d3.select(this)
            .style("stroke", "none")
          });
    }

    updateDateFilter(date: FormGroup<{ start: FormControl<Date | null>; end: FormControl<Date | null>; }>) {
      if(date.value.start && date.value.end){
        this.wantedDate = date;
        this.updateView();
      }
    }

}

