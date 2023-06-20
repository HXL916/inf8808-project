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
    let data = d3.json('./assets/data/deputesLegislatures.json');
    console.log(data);
    this.createGraph(this.process(data));
  }

  createGraph(data:any): void {
    // Define geometry
    let width,
            height,
            widthSquares = 16,
            heightSquares = 9,
            squareSize = 25,
            squareValue = 0,
            gap = 1;
    width = (squareSize * widthSquares) + widthSquares * gap + 25;
    height = (squareSize * heightSquares) + heightSquares * gap + 25;

    // Get color scale
    //let colorScale = setPartyColorScale(data);

    // Get the graph container element
    const container = d3.select('#graph-container');

    // Define your graph logic using D3.js methods
    const svg = container
      .append("svg")
      .attr('class', 'waffle')
      .attr("width", width)
      .attr("height", height);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("class", 'seat')
      .attr("fill", 'black');//d => colorScale(d))
      /*
      .attr("x", function(d, i) {
          //group n squares for column
          let col = Math.floor(i / heightSquares);
          return (col * squareSize) + (col * gap);
      })
      .attr("y", function(d, i) {
          let row = i % heightSquares;
          return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
      });*/
              
  }

  // This function is just an example of how you can process your data
  process(data:any):number{
    return data;
  }
}
