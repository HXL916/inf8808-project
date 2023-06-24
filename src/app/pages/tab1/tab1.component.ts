import { Component, AfterViewInit, ViewEncapsulation  } from '@angular/core';
import * as d3 from 'd3';
import { Legend } from "../../utils/legend";
import { partyColorScale } from "../../utils/scales"
import * as d3Legend from 'd3-svg-legend'
import * as waffle from 'src/app/pages/tab1/waffle';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import * as preproc from './preprocessTab1'


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
      let partyCount = preproc.getPartyCounts(data);
      let dataWaffle = this.preprocessingService.dataWaffle
      let parties:string[] = this.preprocessingService.parties
      //console.log(dataWaffle);
      // Viz
      waffle.drawSquares(dataWaffle, '#waffleChart', partyColorScale, 'Parti',1);
      waffle.drawSquares(dataWaffle, '#waffleChart', partyColorScale, 'Parti',2);
      waffle.drawSquares(dataWaffle, '#waffleChart', partyColorScale, 'Parti',3);
       
      let oldCount = 0,
          newCount=0;
      for (let element of partyCount){
        newCount += Math.round(element['Count'] / 500);
        console.log(oldCount,newCount);
        oldCount = newCount;
      }
      this.waffleLookNice();
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

        // KEY VALUE 1 : percentage of MP who spoke each month on average
        const statSpan1: HTMLSpanElement | null = document.getElementById("stat1") as HTMLSpanElement;
        if (statSpan1) {
          const percentActiveMPs:number = preproc.getPecentageActiveMP(listeDeputes, data)
          // Inject the value into the <span> element
          statSpan1.textContent = percentActiveMPs.toString();
        }

      })

      // KEY VALUES with listedeputes.csv : number of changes since beginning legislature
      d3.csv('./assets/data/listedeputes.csv', d3.autoType).then( (listeDeputes) => {
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
    const width = 10 // à voir si on peut utiliser une variable globale pour ça, width du waffle chart (faudra peut etre soustraire quelque chose ici)
    // j'ajoute directement au svg du waffle chart puis je crée un groupe (g) legend
    var container = d3.select("#legendContainer")
      .append("svg")
      
    container.append('g')
       .attr('class', 'legend')
       .attr('transform', 'translate(' + width + ',+20)') 

    console.log(partyColorScale)

    var legend = d3Legend.legendColor()
      .shape('path', d3.symbol().type(d3.symbolSquare).size(250)()!) // mettre point d'exclamation à la fin parce qu'on sait que c'est non null
      .title('Légende:')
      .shapePadding(10)
      .cells(6)
      .orient('vertical')
      .scale(partyColorScale)  as any

      container.select('.legend')
        .call(legend)

      // Ajout de la cellule suplémentaire qui dit "un carré c'est 1000 interventions"
      const explanationCell = d3.select(".legendCells")
        .append("g")
        .attr("class", "explanationCell")
        .attr('transform', 'translate(0,180)')
      // On récupère la forme des éléments de la légende + la transformation sur le label
      const path = container.select(".swatch").attr("d")
      const transform = container.select(".label").attr("transform")
      explanationCell.append("path")
        .attr("d", path)
        .attr("fill","white")
        .attr("stroke", "black")
      explanationCell.append("text")
        .attr('transform' , transform)
        .text("= 1000 interventions")
    }

  /**
 * Rearrange the waffle chart to git it the looks of the House Of Commons, with an alley in the middle
 */
  waffleLookNice(nbBlocCol = 8,nbBlocRow = 5):void{
    let bigGap = 10;
    
    // Improve placement of the squares
    for (let i=0;i<nbBlocCol;i++){
      for (let j=0;j<nbBlocRow;j++){
        d3.selectAll("rect[col='"+String(i)+"'][row='"+String(j)+"']")
        .attr('transform','translate('+String(bigGap*i)+','+String(bigGap*j)+')');
      }
    }
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
  
  
      const colorScale: any = d3.scaleOrdinal()
          .domain(types)
          .range(d3.schemeTableau10);




      const stack = svg.selectAll('.stack')
        .data(popularinterventions)
        .enter()
        .append('g')
        .attr('class', 'stack')
        .attr('transform', (d) => `translate(${x(d["Beginning"])}, 0)`)

      stack
        .append('rect')
        .attr('x', 0)
        .attr('width', (d) => x(d[1]) - x(d[0]))
        .attr('width', function(d) { return x(d["End"] - d["Beginning"])})
        .attr('height', height)
        .attr('fill', function(d) { return colorScale(d["TypeIntervention"])});

      //Ajoute type d'interventions
      stack
        .append('text')
        .attr('x', (d) => x(d["End"] - d["Beginning"])/2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr("fill", "white")
        .attr("font-size", "1.3em")
        .attr("font-weight", "bold")
        .text((d) => d["TypeIntervention"])
        .call(wrap, 45);

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



function wrap(text: d3.Selection<SVGTextElement, { [key: string]: any }, SVGGElement, unknown>, width: number) {
  text.each(function (this: SVGTextElement, d) {
    const text = d3.select(this)
    const words = text.text().split(/\s+/).reverse()
    let word
    let line:any = []
    const lineHeight = 1.1 // Adjust this value for desired line height
    const x = text.attr('x')
    const y = text.attr('y')
    const dy = parseFloat(text.attr('dy') || '0')
    const maxLines = 4

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
        // Append "..." at the end of the last line
        const lastTspan = text.selectAll('tspan').filter(':last-child');
        const lastLineText = lastTspan.text();
        const truncatedText = lastLineText.slice(0, lastLineText.length - 3) + '...';
        lastTspan.text(truncatedText);
      }
  });
}