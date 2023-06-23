import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'top-flop',
  templateUrl: './top-flop.component.html',
  styleUrls: ['./top-flop.component.css']
})
export class TopFlopComponent implements OnInit {
  @Input() person!: { [key: string]: any }
  nom!: string
  sexe!:string
  province!:string
  circo!:string
  count!:number
  debut!:string
  photo!:string
  locationText!:string
  parti!:string
  constructor() { }

  ngOnInit(): void {
    this.nom = this.person['nom']
    this.sexe = this.person["genre"]
    this.province = this.person["province"]
    this.circo = this.person["Circonscription"]
    this.count = this.person["count"]
    this.photo = this.person["urlPhoto"]
    this.parti = this.person["parti"]

    let debutDate:Date = new Date(this.person["Date de début"])
    let monthArray:string[] = ["janvier", "février", "mars", "avril", "mai", "juin",
                      "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    this.debut = monthArray[debutDate.getMonth()] + " " + debutDate.getFullYear()

    this.locationText = "Élu"
    if(this.sexe==="F"){
      this.locationText += "e"
    }
    this.locationText += " de " + this.circo + " (" + this.province + ")"
  }

}
