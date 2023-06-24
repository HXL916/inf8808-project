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
    if (this.selectedTypes.includes(intervention)) {
      this.selectedTypes = this.selectedTypes.filter(type => type !== intervention);
      document.getElementById(intervention)!.style.background="rgba(138, 180, 118, 0.5)";
    }
    else {
      this.selectedTypes.push(intervention);
      document.getElementById(intervention)!.style.background="#8AB476";
    }
    console.log(this.selectedTypes);
  }

}
