import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.css']
})
export class FilterButtonComponent implements OnInit {
  @Output() filterChange = new EventEmitter<string>();
  wantedKey:string;
  
  constructor() {    
    this.wantedKey = "genre";
  }

  ngOnInit(): void {
  }

  updateWantedKey(key:string):void{
    this.wantedKey=key;
    this.filterChange.emit(this.wantedKey);
    // this.updateView(); // based on key
  }
}
