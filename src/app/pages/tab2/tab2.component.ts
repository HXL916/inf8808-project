import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
//import { setPartyColorScale } from 'src/app/utils/scales';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css']
})
export class Tab2Component  implements AfterViewInit   {
  colorScale!: any;
  wantedKey:string;
  constructor() {
    this.wantedKey = "genre";
    //this.wantedKey = "Province / Territoire";
    //this.wantedKey = "Affiliation Politique";
  }

  ngAfterViewInit(): void {
    d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (data)=>{
      this.createGraph(this.process(data));
    });
    
  }

/**
 * Draws the waffle chart
 *
 * @param {object[]} data The data to use
 */
  createGraph(data: { [key: string]: any }[]): void {
    console.log(data);
    // Define geometry
    let svgPadding = 20,
        squareSize = 20,
        smallGap = 5,
        bigGap = 10,
        alleyGap = 20,

        nbRowInBloc = 4,
        nbColInBloc = 5,
        nbBlocRow = 5,
        nbBlocCol = 4,

        nbRow = nbRowInBloc*nbBlocRow,  // 16 rows of squares in total
        nbCol = nbColInBloc*nbBlocCol,  // 20 columns of squares in total
        nbSquaresinBloc = nbRowInBloc*nbColInBloc, // 20 squares per bloc

        width = 1000,// blocWidth*nbBlocCol+bigGap*(nbBlocCol-1), //788 for now
        height = 1000; // blocHeight*nbBlocRow+bigGap*(nbBlocRow-2)+alleyGap;  //666 for now
    
    // Get the graph container element and create the svg
    const container = d3.select('#graph-container');
    const svg = container
      .append("svg")
      .attr('class', 'waffle')
      .attr("width", width)
      .attr("height", height);

    // Draw the squares of the waffle
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("class", function(d,i){
        return 'seat-'+String(i);
      })
      .attr("fill", (d)=>this.colorScale(d[this.wantedKey]))
      .attr("x", function(d, i) {
        let col = i % nbCol;
        return col * (squareSize+smallGap);
      })
      .attr("y", function(d, i) {
          let row = Math.floor(i / nbCol);
          return row * (squareSize+smallGap)+svgPadding;
      })
      .attr('row', function(d,i) {
        return Math.floor(i / (nbSquaresinBloc*nbBlocCol));
      })
      .attr('col', function(d,i) {
        return Math.floor(((i%(nbSquaresinBloc*nbBlocCol))%nbCol)/nbColInBloc);
      });

      // Improve placement of the squares
      for (let i=0;i<nbBlocCol;i++){
        for (let j=0;j<Math.floor(nbBlocRow/2);j++){
          d3.selectAll("rect[col='"+String(i)+"'][row='"+String(j)+"']")
          .attr('transform','translate('+String(bigGap*i)+','+String(bigGap*j)+')');
        }
        for (let j=Math.floor(nbBlocRow/2);j<nbBlocRow;j++){
          d3.selectAll("rect[col='"+String(i)+"'][row='"+String(j)+"']")
          .attr('transform','translate('+String(bigGap*i)+','+String(alleyGap+bigGap*j)+')');
        }
      }
      // Début de recherche si on voulait mettre les derniers blocs sur le côté plutôt qu'en dessous
      //d3.selectAll("rect[row='"+String(nbBlocRow-1)+"']")
      //  .attr('x');
      
              
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
      case "Affiliation Politique":
        this.colorScale = d3.scaleOrdinal().domain(["BQ", "PCC", "PLC", "NPD", "PV", "Ind.", "Autres", "FCC", "PPC"]).range(["#159CE1", "#002395" , "#ED2E38", "#FF8514", "#30D506", "#AAAAAA", "#AAAAAA", "#AAAAAA", "#AAAAAA"]);
        break;
      case "Province / Territoire":
        let provinces = data.map(obj => obj["Province"]).sort();
        this.colorScale = d3.scaleOrdinal().domain(provinces).range(d3.schemeTableau10);
        break;
    } 

    // Get the wanted Legislature from the slide button
    var wantedLegislature = 44;

    // Filter the MPs from this legislature
    return data.filter((d)=>d['legislature'] == wantedLegislature)
               .sort((x, y)=>d3.ascending(x[this.wantedKey], y[this.wantedKey]));
  }
}
