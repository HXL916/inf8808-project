import { Component, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css']
})
export class SeatComponent {
  size!: number;
  posX!: number;
  posY!: number;
  color!: string;      //String for HEX color

  ngOnInit(){
    // Init : black square 25x25 in the top left corner
    this.size = 25;
    this.posX = 0;
    this.posY = 0;
    this.color = "000000";
  }

  drawSeat(){
    d3.select("svg")
      .append('rect')
      .attr('width',this.size)
      .attr('height',this.size)
      .attr('x',this.posX)
      .attr('y',this.posY)
      .attr('fill',this.color);
  }


}
