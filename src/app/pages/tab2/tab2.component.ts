import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
//import { setPartyColorScale } from 'src/app/utils/scales';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css']
})
export class Tab2Component  implements AfterViewInit   {

  constructor() {}

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
    let squareSize = 25,
        smallGap = 12,
        nbRowInBloc = 4,
        nbColInBloc = 5,
        nbBlocRow = 4,
        nbBlocCol = 4,

        nbSquaresInBloc = nbRowInBloc*nbColInBloc,  //20 squares per bloc
        nbRow = nbRowInBloc*nbBlocRow,  // 16 rows of squares in total
        nbCol = nbColInBloc*nbBlocCol,  // 20 columns of squares in total
        nbSquares = nbRow*nbCol,  //320 squares for now

        amountSquareBlocWidth = 5,
        amountSquareBlocHeight = 4,
        amountSquareBloc = amountSquareBlocHeight*amountSquareBlocWidth,  //20 squares per bloc

        bigGap = 32,
        alleyGap = 58,
        
        amountSquareGlobalWidth = amountSquareBloc*nbBlocCol,  //80 squares per line of bloc
        amountSquareGlobalHeigth = amountSquareBloc*nbBlocRow,  

        blocWidth = squareSize*amountSquareBlocWidth+smallGap*(amountSquareBlocWidth-1),  //173
        blocHeight = squareSize*amountSquareBlocHeight+smallGap*(amountSquareBlocHeight-1), //136
        width = blocWidth*nbBlocCol+bigGap*(nbBlocCol-1), //788 for now
        height = blocHeight*nbBlocRow+bigGap*(nbBlocRow-2)+alleyGap;  //666 for now

    // Get color scale
    //let colorScale = setPartyColorScale(data);

    // Get the graph container element and create the svg
    const container = d3.select('#graph-container');
    const svg = container
      .append("svg")
      .attr('class', 'waffle')
      .attr("width", width)
      .attr("height", height);
      //.attr('transform', 'translate(0,'+height+'+90+10)');  // 90 is the height of the banner


    svg.selectAll('rect')
      .data(data)
      .enter()
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("class", 'seat')
      .attr("fill", function(d){
        return 'black';
        //return colorScale(d.attribut);
      }
        )
        .attr("x", function(d, i) {
          //group n squares for column
          let col = Math.floor(i / nbRow);
          return (col * squareSize) + (col * smallGap);
      })
      .attr("y", function(d, i) {
          let row = i % nbRow;
          return (nbRow * squareSize) - ((row * squareSize) + (row * smallGap))
      });

      // Improve placement of the squares
      d3.selectAll("rect[x>='173']")
        .attr('transform','translate(20,0)');
              
  }

  /**
 * Keeps only the MPs from the selected Legislature.
 *
 * @param {object[]} data The data to analyze
 * @returns {object[]} output The data filtered
 */
  process(data: { [key: string]: any }[]):{ [key: string]: any }[]{

    // Get the wanted Legislature from the slide button
    var wantedLegislature = 44;

    // Filter the MPs from this legislature
    return data.filter((d)=>d['legislature'] == wantedLegislature);
  }
}
