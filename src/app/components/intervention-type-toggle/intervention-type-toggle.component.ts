import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-intervention-type-toggle',
  templateUrl: './intervention-type-toggle.component.html',
  styleUrls: ['./intervention-type-toggle.component.css'],
})
export class InterventionTypeToggleComponent implements OnInit {
  @Output() filterChange = new EventEmitter<string[]>();
  
  interventionTypes: string[] = [
    'Déclarations de députés',
    'Questions orales',
    'Affaires courantes',
    'Ordres émanant du gouvernement',
    'Recours au Règlement',
    'Travaux des subsides',
    'Affaires émanant des députés',
    'Autre',
  ];
  selectedTypes = this.interventionTypes;

  ngOnInit(): void {}

  toggle(intervention: string): void {
    if (this.selectedTypes.includes(intervention)) {
      // OFF
      this.selectedTypes = this.selectedTypes.filter(
        (type) => type !== intervention
      );
      this.filterChange.emit(this.selectedTypes);
    } else {
      // ON
      this.selectedTypes.push(intervention);
      this.filterChange.emit(this.selectedTypes);
    }
  }
}
