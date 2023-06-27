import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intervention-type-toggle',
  templateUrl: './intervention-type-toggle.component.html',
  styleUrls: ['./intervention-type-toggle.component.css'],
})
export class InterventionTypeToggleComponent implements OnInit {
  interventionTypes: string[] = ["Questions orales", "Affaires émanant des députés", "Déclarations des députés", "Budget", "Initiatives parlementaires", "Initiatives ministérielles", "Travaux des subsides", "Autres"]
  selectedTypes = this.interventionTypes; 

  ngOnInit(): void {
    
  }

  toggle(intervention: string): void {
    if (this.selectedTypes.includes(intervention)) { // OFF
      this.selectedTypes = this.selectedTypes.filter(type => type !== intervention);
    }
    else { // ON
      this.selectedTypes.push(intervention);
    }
  }
}
