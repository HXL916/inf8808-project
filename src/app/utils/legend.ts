import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})


export class Legend {

  constructor() {}
  public scaleColor(domain:string[]):any{
    return d3.scaleOrdinal().range(d3.schemeTableau10).domain(domain);  
  }
  

}
