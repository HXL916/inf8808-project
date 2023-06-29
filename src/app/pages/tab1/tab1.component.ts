import { Component, AfterViewInit, ViewEncapsulation, OnInit  } from '@angular/core';
import * as d3 from 'd3';

import { partyColorScale } from "../../utils/scales"
import * as waffle from 'src/app/pages/tab1/waffle';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import * as preproc from './preprocessTab1'
import * as stackedBarChart from 'src/app/pages/tab1/stackedBar'


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab1Component implements OnInit  {
  itemList!: any;
  color!: any;
  xScale!: any;
  yScale!: any;
  pourcent!: any;
  topMPs!: {}[]
  flopMPs!: {}[]
  data:any;

  constructor(private preprocessingService: PreprocessingService) {
  }

  async ngOnInit() {
    try {
      await this.preprocessingService.isInitialized().toPromise();
      this.createWaffleGraph();
      
      // BAR CHART
      // Preprocess
      let popularInterventions:{ [key: string]: any }[] = this.preprocessingService.popularInterventions
      // Viz
      stackedBarChart.createStackedBarChart(popularInterventions)


      // get the interventions for the current legislature (44)
      let recentInterventions = this.preprocessingService.recentInterventions
      

      // KEY VALUES with deputesLegislatures.csv + TOP & FLOP
        const listeDeputes44:{ [key: string]: any }[] = this.preprocessingService.listeDeputes44
        // preprocessing for top & flop
        let interestingMPs = this.preprocessingService.interestingMPs 
        this.topMPs = interestingMPs["topMPs"]
        this.flopMPs = interestingMPs["flopMPs"]
        // prepcoessing for Key value: increase in number of women
        this.addingStatIncreaseWomen()
        // KEY VALUE 1 : percentage of MP who spoke each month on average
        this.addingStatActiveMPs(this.preprocessingService.deputesLegislatures, this.preprocessingService.debats)        


      // KEY VALUES with listedeputes.csv : number of changes since beginning legislature
        const changesLegislature44 : { [key: string]: any }[] = this.preprocessingService.changesLegislature44
        this.addingStatChangeLegislature(changesLegislature44)
    } catch (error) {
      console.error(
        'Error while initializing preprocessingService on tab3: ',
        error
      );
    }
  }

  
  async createWaffleGraph():Promise<void>{
    let dataWaffle = this.preprocessingService.dataWaffle
    // Viz
    for (let index=0; index<dataWaffle.length;index++){
      await waffle.drawSquares(dataWaffle[index], '#waffleContainerInner', partyColorScale, 'Parti',index);
    }
    await this.waffleLookNice(dataWaffle.length);
    await waffle.drawWaffleLegend(partyColorScale, this.preprocessingService.getScale());
  }    
  /**
 * Rearrange the waffle chart to git it the looks of the House Of Commons, with an alley in the middle
 */
  waffleLookNice(nbRow:number, nbBlocCol = 8,nbBlocRow = 5):void{
    let bigGap = 8;
    
    // Improve placement of the squares
    for (let row=0;row<nbRow;row++){
      for (let i=0;i<nbBlocCol;i++){
        d3.selectAll("rect[col='"+String(i)+"'][row='"+String(row)+"']")
        .attr('transform','translate('+String(bigGap*i)+',0)');
      }
    }
  }


  /**
   * Key stats functions
   */

  // get the increase in women between the last 2 legislatures, and inject it in html code
  addingStatIncreaseWomen():void{
    // get the increase in women already preprocessed in the service (it's static: we compute it only once)
    const increaseWomen:string = this.preprocessingService.increaseWomen 
    // get the html element where to put this stat, and then add this stat as text
    const statSpan3: HTMLSpanElement | null = document.getElementById("stat3") as HTMLSpanElement;
    if (statSpan3) {
      // Inject the value into the <span> element
      statSpan3.textContent = increaseWomen;
    }
  }

  // get the average of the number of MPs who participated for each month, and inject it in html code
  addingStatActiveMPs(listeDeputes: { [key: string]: any }[], interventionData:{ [key: string]: any }[]):void{
    // get the html element where to put this stat
    const statSpan1: HTMLSpanElement | null = document.getElementById("stat1") as HTMLSpanElement;
    if (statSpan1) {
      // get the statistic already preprocessed in the service (it's static: we compute it only once)
      //const percentActiveMPs:number = preproc.getPecentageActiveMP(listeDeputes, interventionData)
      const percentActiveMPs:number = this.preprocessingService.percentageActiveMP;
      // Inject the value into the <span> element
      statSpan1.textContent = percentActiveMPs.toString();
    }
  }

  // get the number of MPs who changed their affiliation to a political party during the current legislature and inject it in html code
  addingStatChangeLegislature(changesLegislature44: { [key: string]: any }[]){
    // changesLegislature44 = array with all the MP who changed their party during the current legislature
    // it should be processed in the service because it's static (we use it only once)
    const statSpan2: HTMLSpanElement | null = document.getElementById("stat2") as HTMLSpanElement;
    if (statSpan2) {
      // for question of style, we create an inner span. The text in this span will be bold and big (class = statValue)
      // depending of the value of the stat, we also change the text in statSpan2
      const innerStatSpan: HTMLSpanElement = document.createElement("span");
      innerStatSpan.classList.add("statValue");
      if(changesLegislature44.length == 0){ // if we didn't notce any change
        innerStatSpan.textContent = "Aucun" // this text will be bold
        const textAfter: Text = document.createTextNode(" député n'a") // this text will be normal
        statSpan2.appendChild(innerStatSpan)
        statSpan2.appendChild(textAfter)
      }
      else if(changesLegislature44.length == 1){ // if only one MP changed his party, we diplay his name
        innerStatSpan.textContent = "1" // this text will be bold
        const textAfter: Text = document.createTextNode("député ("+changesLegislature44[0]["nom"]+") a") // this text will be normal
        statSpan2.appendChild(innerStatSpan)
        statSpan2.appendChild(textAfter)
      }
      else{ // several changes
        innerStatSpan.textContent = changesLegislature44.length.toString()  // this text will be bold (number of MPs who changed)
        const textAfter: Text = document.createTextNode(" députés ont") // this text will be normal
        statSpan2.appendChild(innerStatSpan)
        statSpan2.appendChild(textAfter)
      }
    }
  }
}



