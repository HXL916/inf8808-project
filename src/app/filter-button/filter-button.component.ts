import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.css']
})
export class FilterButtonComponent implements OnInit {
  wantedKey:string;
  
  constructor() {    
    this.wantedKey = "genre";
  }

  ngOnInit(): void {
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    // this.updateView(); // based on key
  }
}
