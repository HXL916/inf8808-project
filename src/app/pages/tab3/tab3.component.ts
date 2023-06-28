import { Component, OnInit } from '@angular/core';
import { Legend } from './../../utils/legend';
import { genderColorScale, partyColorScale, provinceColorScale, translatePretty, translateDate } from "../../utils/scales"
import * as d3 from 'd3';
import * as waffle1 from 'src/app/pages/tab1/waffle';
import * as preprocessTab3 from 'src/app/pages/tab3/preprocessTab3';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseType } from 'd3';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})
export class Tab3Component  implements OnInit  {
  wantedKey!:string;
  wantedDate!: FormGroup<{ start: FormControl<Date | null>; end: FormControl<Date | null>; }>;
  wantedInterventions!: string[];
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
    this.wantedInterventions = ["Déclarations de députés", "Questions orales", "Affaires courantes", "Ordres émanant du gouvernement", "Recours au Règlement", "Travaux des subsides", "Affaires émanant des députés", "Autre"]

  }

  ngOnInit(): void {
    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => {
      this.data = data
      // 44ème législature
      const filterData = preprocessTab3.getInterventionsByDateRange(data, this.wantedDate.value.start!, this.wantedDate.value.end!)
      //console.log(filterData)
      let groupedArrays = preprocessTab3.groupInterventionByMonth(filterData)
      groupedArrays = preprocessTab3.groupSeveralMonths(groupedArrays)
      //console.log("groupedArrays", groupedArrays)
      const groupedArraysByType = preprocessTab3.getInterventionsByType(groupedArrays, this.wantedInterventions)
      let Ymax = preprocessTab3.getMaxCharCounts(groupedArraysByType)/1000000
      //console.log("Ymax", Ymax)
      const timeGroups = Object.keys(groupedArraysByType)
      //console.log("time groups", timeGroups)
      
      this.createGraphBase(timeGroups, Ymax)
      this.generateBarChart(groupedArraysByType)
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
    this.ngOnInit();
  }

  // crée la base du graph: svg element, axes, titre?
  createGraphBase(timeGroups: string[], Ymax:number) : void{
    var margin = {top: 30, right: 30, bottom: 30, left: 120},
    width = 1200- margin.left - margin.right,
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
  
    this.xScale = d3.scaleBand().domain(timeGroups).range([0, width]).paddingInner(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(this.xScale).tickSizeOuter(0))
      .attr('text-anchor', 'middle')
      .selectAll(".tick text")
      .call(wrap,50);

    this.yScale = d3.scaleLinear().domain([0, Ymax]).range([ 0, height]);
    const axisTitle = svg.append("g").call(d3.axisLeft(d3.scaleLinear().domain([0, Ymax]).range([ height,0]))).append("text")
    .attr("class", "axis-title")
    .attr("y", -3)
    .attr("dy", ".21em")
    .attr('text-anchor', 'beginning')
    .attr('font-size','1.2em')
    .attr("fill", "black")
    .text(null)
    axisTitle.append('tspan')
      .attr('x', -5).attr('y', "0").attr('dy', '-1em')
      .text('Millions de')
    axisTitle.append('tspan')
      .attr('x', -5).attr('y', "0").attr('dy', '0.2em')
      .text('caractères*')

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
  updateLegendName():string{
    var legend = ''
    switch (this.wantedKey){
      case "genre":
        legend = "le genre";
        break;
      case "parti":
        legend = "le parti politique";
        break;
      case "province":
        legend = "la province";
        break;
    } 
    return legend;
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
    let wantedInterventions = this.wantedInterventions

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
        .attr('height', function(d) { return yScale(d["End"]/1000000 - d["Beginning"]/1000000)})
        .attr("y", function(d) {  return height - yScale(d["End"]/1000000)})
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

  updateInterventionTypes(interventionTypes: string[]) {
    console.log(interventionTypes)
    this.wantedInterventions = interventionTypes;
    this.updateView();
  }

}
function wrap(text: d3.Selection<BaseType, unknown, SVGGElement, any>, width: number) {
  text.each(function (this: BaseType, d) {
    const text = d3.select(this)
    const words = text.text().split(/\s+/).reverse()
    let word
    let line:any = []
    const lineHeight = 1.1 // Adjust this value for desired line height
    const x = text.attr('x') || 0
    const y = text.attr('y') || 0
    const dy = parseFloat(text.attr('dy') || '0')
    const maxLines = 2

    let tspan = text
    .text(null)
    .append('tspan')
    .attr('x', x)
    .attr('y', y)
    .attr('dy', dy + 'em')

    let lineCount = 0;


    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node()!.getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineCount * lineHeight + dy + 'em')
          .text(word);
      }
    }

    // Check if the maximum number of lines is reached
    if (lineCount >= maxLines) {
      // Append text of the third line to the second line
      const secondLineTspan = text.selectAll('tspan').filter(':nth-child(2)');
      const thirdLineTspan = text.selectAll('tspan').filter(':nth-child(3)');
      secondLineTspan.text(secondLineTspan.text() + ' ' + thirdLineTspan.text());
      thirdLineTspan.remove();
    }
  });
}