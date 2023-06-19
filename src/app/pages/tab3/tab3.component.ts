import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})
export class Tab3Component  implements AfterViewInit  {

  constructor() {}

  ngAfterViewInit(): void {
    this.createGraph(this.process("test"));
  }

  createGraph(data:any): void {
    // Get the graph container element
    const container = d3.select('#graph-container');

    // Define your graph logic using D3.js methods
    // For example, create a simple SVG circle
    container
      .append('svg')
      .attr('width', 200)
      .attr('height', 200)
      .append('circle')
      .attr('cx', 100)
      .attr('cy', 100)
      .attr('r', 50)
      .attr('fill', 'blue');
  }
  // This function is just an example of how you can process your data
  process(data:any):number{
    console.log(data);
    return data;
  }
}
