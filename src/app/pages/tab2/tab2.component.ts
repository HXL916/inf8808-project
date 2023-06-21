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
        smallGap = 10,
        bigGap = 25,
        alleyGap = 30,

        nbRowInBloc = 4,
        nbColInBloc = 5,
        nbBlocRow = 4,
        nbBlocCol = 4,

        nbRow = nbRowInBloc*nbBlocRow,  // 16 rows of squares in total
        nbCol = nbColInBloc*nbBlocCol,  // 20 columns of squares in total
        nbSquaresinBloc = nbRowInBloc*nbColInBloc, // 20 squares per bloc

        width = 1000,// blocWidth*nbBlocCol+bigGap*(nbBlocCol-1), //788 for now
        height = 1000; // blocHeight*nbBlocRow+bigGap*(nbBlocRow-2)+alleyGap;  //666 for now

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
      .attr("class", function(d,i){
        return 'seat-'+String(i);
      })
      .attr("fill", function(d){
        return 'black';
        //return colorScale(d.attribut);
      })
      .attr("x", function(d, i) {
          //group n squares for column
          let col = i % nbCol;
          return col * (squareSize+smallGap);
      })
      .attr("y", function(d, i) {
          let row = Math.floor(i / nbCol);
          return row * (squareSize+smallGap);
      })
      .attr('row', function(d,i) {
        return Math.floor(i / (nbSquaresinBloc*nbBlocCol));
      })
      .attr('col', function(d,i) {
        return Math.floor(((i%(nbSquaresinBloc*nbBlocCol))%nbCol)/nbColInBloc);
        //return Math.floor(((i%80)%20)/5);
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
