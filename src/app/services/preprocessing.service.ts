import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PreprocessingService {
  // This service is used to preprocess the data before displaying it in the graphs
  // The following attributes store the preprocessing results and accessed in the three tabs
  parties!: string[];
  topMPs!: any;
  flopMPs!: any;
  nbInterventionsByParty!: { [key: string]: any }[];
  dataWaffle!: any[];
  popularInterventions!: { [key: string]: any; }[];
  recentInterventions!: { [key: string]: any; }[];
  listeDeputes44!: any;
  interestingMPs!: any;
  listeDeputes43!: any;
  increaseWomen!: string;
  changesLegislature44!: any;
  nbInterventionsByType!: { [key: string]: any }[];
  dataIsLoaded: Subject<boolean> = new Subject<boolean>();
  sortedData: any;
  waffleScale:number;

  


  constructor() {
    this.waffleScale = 500;

    d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType).then( (data) => { // utiliser (data)=> permet de garder le .this qui référence le Tab1Component
      // WAFFLE CHART
      // Preprocess
      this.nbInterventionsByParty = this.getPartyCounts(data);
      this.parties = this.getPartiesNames(data);
      this.dataWaffle = this.convertToWaffleCompatible(this.nbInterventionsByParty,this.waffleScale);    
      this.nbInterventionsByType = this.getTypeInterventionCounts(data)
      this.popularInterventions = this.getPopularInterventionTypes(this.nbInterventionsByType)
      this.recentInterventions = this.getInterventionsLegislature(data, "44-1")   

      // KEY VALUES with deputesLegislatures.csv + TOP & FLOP
      d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType).then( (listeDeputes) => {
        this.listeDeputes44 = this.getMPsLegislature(listeDeputes, "44")
        // preprocessing for top & flop
        this.interestingMPs = this.getInterestingMPs(this.listeDeputes44, this.recentInterventions)
        this.topMPs = this.interestingMPs["topMPs"]
        this.flopMPs = this.interestingMPs["flopMPs"]
        // preprocessing for Key value: increase in number of women
        this.listeDeputes43 = this.getMPsLegislature(listeDeputes, "43")
        this.increaseWomen = this.getIncreaseWomen(this.listeDeputes43, this.listeDeputes44) 
        console.log(this.increaseWomen)
      })

      // KEY VALUES with listedeputes.csv : number of changes since beginning legislature
      d3.csv('./assets/data/listedeputes.csv', d3.autoType).then( (listeDeputes) => {
        this.changesLegislature44  = this.getNbChangesLegislature(listeDeputes, "441")
      })
    })

    console.log('PreprocessingService created');
    this.dataIsLoaded.next(true);
    this.dataIsLoaded.complete();
    
  }

  // TAB 1 PREPROCESSING FUNCTIONS

  /**
   * Gets the names of the political parties (as written in debatsCommunes.csv).
   *
   * @param {object[]} data The data to analyze
   * @returns {string[]} The names of the parties in the data set
   */
  getPartiesNames(data: { [key: string]: any }[]): string[] {
    let parties: string[] = [];
    parties = data.map((obj) => obj['parti']);
    // Filter it to avoid duplicates
    parties = parties.filter(
      (value, index, array) => array.indexOf(value) === index
    );
    return parties;
  }

  /**
   * Gets the number of intervention for each political party.
   *
   * @param {{ [key: string]: any }[]} data The data to analyze
   * @returns {{ [key: string]: any }[]}  A table of objects with keys 'parti',  containing
   * the name of the number of interventions for each party in the dataset
   */
  getPartyCounts(data: { [key: string]: any }[]): { [key: string]: any }[] {
    const partyCounts: { [key: string]: number } = {};
    for (const obj of data) {
      if (obj.hasOwnProperty('parti')) {
        const partyName = obj['parti'];
        if (partyCounts.hasOwnProperty(partyName)) {
          partyCounts[partyName]++;
        } else {
          partyCounts[partyName] = 1;
        }
      }
    }

    const summarizedData: { [key: string]: any }[] = [];
    Object.keys(partyCounts).forEach((element) => {
      summarizedData.push({ Parti: element, Count: partyCounts[element] });
    });
    return summarizedData;
  }

  /**
   * Gets the number of intervention for each type of intervention.
   *
   * @param {{ [key: string]: any }[]} data The data to analyze
   * @returns { [key: string]: any }[]  A table of objects with keys 'TypeIntervention',  containing
   * the name of the number of interventions for each party in the dataset, and 'Count' containing the number of interventions
   */
  getTypeInterventionCounts(
    data: { [key: string]: any }[]
  ): { [key: string]: any }[] {
    const typeInterventionCount: { [key: string]: number } = {};
    for (const obj of data) {
      if (obj.hasOwnProperty('typeIntervention')) {
        const interventionType = obj['typeIntervention'];
        if (typeInterventionCount.hasOwnProperty(interventionType)) {
          typeInterventionCount[interventionType]++;
        } else {
          typeInterventionCount[interventionType] = 1;
        }
      }
    }

    const summarizedData: { [key: string]: any }[] = [];
    Object.keys(typeInterventionCount).forEach((element) => {
      summarizedData.push({
        TypeIntervention: element,
        Count: typeInterventionCount[element],
      });
    });
    return summarizedData;
  }

  /**
   * Adapts a list of [{'parti','count'}] to the waffle function from utils,
   * by making it a list of ['parti] with as much elements as thousands in the count
   *
   * @param {{ [key: string]: any }[]} data The data to analyze
   * @returns { [key: string]: any }[]  A table of objects with keys 'Parti',
   * each object significates 1000 interventions by this Parti
   */
  convertToWaffleCompatible( data: { [key: string]: any }[], scale:number): any[] {
    const allData: { [key: string]: any }[] = [];
    const summarizedData: any[]=[];
    for (const obj of data) {
      let thousands = Math.round(obj['Count'] / scale);
      for (let i = 0; i < thousands; i++) {
        allData.push({ Parti: obj['Parti'] });
      }
    }
    for (let party of ['PCC','NPD','PLC']){
      let data = allData.filter((d)=>d['Parti']==party);
      summarizedData.push(data);
    }
    let otherParties = ['BQ','PV','Ind.'];
    summarizedData.push(allData.filter((d)=>otherParties.indexOf(d['Parti']) > -1));
    
    return summarizedData;
  }

  getScale():number{return this.waffleScale}

  /**
   * Gets the 5 types of interventions with the most intervention, merge the others in "Autres" type
   *
   * @param {{[key: string]: any}[]} summarizedData The data to analyze, has to have keys 'TypeIntervention' and 'Count' for each object
   * @returns {string[]} An array of objects like in summerizedData, but with only top 6 TypeIntervention + 'Autres'
   */
  getPopularInterventionTypes(
    summarizedData: { [key: string]: any }[]
  ): { [key: string]: any }[] {
    const sortedData = summarizedData.sort((a, b) => b['Count'] - a['Count']);
    const topParties = sortedData.slice(0, 6);
    // Sum the counts of the remaining parties
    const otherCount = sortedData
      .slice(6)
      .reduce((sum, data) => sum + data['Count'], 0);

    // Create the new array with the top parties and the "Other" party
    const newData = [
      ...topParties,
      { TypeIntervention: 'Autres', Count: otherCount },
    ];
    return newData;
  }

  /**
   * Filter the data to keep only the interventions for a specified legislature
   *
   * @param {{ [key: string]: any }[]} data The data to analyze (list of interventions)
   * @param {string} legislature The legislature to keep
   * @returns {{ [key: string]: any }[]} A filtered list of interventions
   */
  getInterventionsLegislature(
    data: { [key: string]: any }[],
    legislature: string
  ): { [key: string]: any }[] {
    const filteredData: { [key: string]: any }[] = data.filter(
      (obj) => obj['legislature'] === legislature
    );
    return filteredData;
  }

  /**
   * Filter the list of MPs to keep only the MPs for a specified legislature
   *
   * @param {{ [key: string]: any }[]} listeDeputes The data to analyze (list of MPs)
   * @param {string} legislature The legislature to keep
   * @returns {{ [key: string]: any }[]} A filtered list of MPs
   */
  getMPsLegislature(
    listeDeputes: { [key: string]: any }[],
    legislature: string
  ): { [key: string]: any }[] {
    const filteredData: { [key: string]: any }[] = listeDeputes.filter(
      (obj) => obj['legislature'] == legislature
    );
    return filteredData;
  }

  /**
   * Preprocessing for Top & Flop
   *
   * @param {{ [key: string]: any }[]} listeDeputes the list of MPs (for one legislature)
   * @param {{ [key: string]: any }[]} interventionsData All the interventions for the same legislature
   * @returns {any} On object with keys "topMPs" and "flopMPs", each containing an array of 3 objects
   *                 representing an MP with all his attributes + "count" being the number of intervention of this MP
   */
  getInterestingMPs(
    listeDeputes: { [key: string]: any }[],
    interventionsData: { [key: string]: any }[]
  ): any {
    const nameCounts: { [name: string]: number } = {};
    interventionsData.forEach((obj) => {
      const name = obj['nom'];
      nameCounts[name] = (nameCounts[name] || 0) + 1;
    });

    const listeDeputesWithCount = listeDeputes.map((obj) => ({
      ...obj,
      count: nameCounts[obj['nom']] || 0,
    }));
    // sort by count value
    listeDeputesWithCount.sort((a, b) => b.count - a.count);
    // Get the top 3 entries with the highest values for "count"
    const topEntries = listeDeputesWithCount.slice(0, 3);
    // Get the 3 entries with the lowest values for "count"
    const lowestEntries = listeDeputesWithCount.slice(-3);
    const result: { [name: string]: any } = {
      topMPs: topEntries,
      flopMPs: lowestEntries,
    };
    return result;
  }

  /**
   * Preprocessing for stat : increase in the number of women
   *
   * @param {{ [key: string]: any }[]} previousMPs the list of MPs (for one legislature)
   * @param {{ [key: string]: any }[]} newMPs the list of MPs (for another legislature)
   * @returns {string} A string representing the number (+8, -9, ...), to inject in the DOM
   */
  getIncreaseWomen(
    previousMPs: { [key: string]: any }[],
    newMPs: { [key: string]: any }[]
  ): string {
    const previousNumberOfWomen: number = previousMPs.filter(
      (obj) => obj['genre'] === 'F'
    ).length;
    const newNumberOfWomen: number = newMPs.filter(
      (obj) => obj['genre'] === 'F'
    ).length;
    const increase: number = newNumberOfWomen - previousNumberOfWomen;
    console.log(previousNumberOfWomen, newNumberOfWomen);
    if (increase < 0) {
      return increase.toString();
    } else {
      return '+' + increase.toString();
    }
  }

  /**
   * Preprocessing for stat : number of changes since the beginning of this legislature
   *
   * @param {{ [key: string]: any }[]} listMPs the list of MPs (data from Jean Hugues, with the changes)
   * @param {{ [key: string]: any }[]} legislature legislature where the changes happened
   * @returns {{[key: string]: any }[]} An array with all the changes. We can get the number after the preprocessing with array.length
   */
  getNbChangesLegislature(
    listMPs: { [key: string]: any }[],
    legislature: string
  ): { [key: string]: any }[] {
    const filteredData: { [key: string]: any }[] = listMPs.filter(
      (obj) => obj['ch1-legislature'] == legislature
    );
    return filteredData;
  }

  // TAB 2 PREPROCESSING FUNCTIONS
  splitByLegislature(data: { [key: string]: any }[]): { [key: number]: { [key: string]: any }[] } {
    const dataByLegislature: { [key: number]: { [key: string]: any }[] } = {};
  
    for (const depute of data) {
      const legislature = depute['legislature'];
  
      if (!dataByLegislature.hasOwnProperty(legislature)) {
        dataByLegislature[legislature] = [];
      }
  
      dataByLegislature[legislature].push(depute);
    }
  
    return dataByLegislature;
  }

  /**
 * Gets the names of the political parties (as written in debatsCommunes.csv).
 *
 * @param {object[]} data The data to analyze
 * @returns {string[]} The names of the parties in the data set
 */
  getPartiesNamesTab2(data: { [key: string]: any }[]): string[] {
    return Array.from(new Set(data.map(obj => obj["parti"]))).sort();
  }

  // TAB 3 PREPROCESSING FUNCTIONS

  // TODO: add description
    getInterventionsYear(data: { [key: string]: any }[], annee:number):{ [key: string]: any }[]{
      const filteredData: { [key: string]: any }[] = data.filter(obj => obj["année"] === annee);
      return filteredData;
  }


  /**
   * Gets the number of intervention by specific period for each type of intervention.
   *
   * @param {{ [key: string]: any }[]} data The data to analyze
   * @param {number} year The year for which the intervention type should be retrieved
   * @param {number} month The month for which the intervention type should be retrieved
   * @param { string } wantedKey The data to analyze
   * @returns { [key: string]: any }[]  A table of objects with keys 'TypeIntervention',  containing
   * the name of the number of interventions for each party in the dataset, and 'Count' containing the number of interventions
   */
  getTypeInterventionCountsByPeriod(data: { [key: string]: any }[], year: number, month: number, wantedKey: string): { [key: string]: any }[] {
      const keyCount: { [key: string]: number } = {};
    
      for (const obj of data) {
        if (obj.hasOwnProperty(wantedKey) && obj['année'] === year && obj['month'] === month) {
          const key = obj[wantedKey];
          if (keyCount.hasOwnProperty(key)) {
              keyCount[key]++;
          } else {
              keyCount[key] = 1;
          }
        }
      }
    
      const summarizedData : { [key: string]: any }[] = [];
      switch (wantedKey){
          case "genre":
              Object.keys(keyCount).forEach(element => {
                  summarizedData.push( {"Genre": element, "Count": keyCount[element]})
                });
              break;
          case "parti":
              Object.keys(keyCount).forEach(element => {
                  summarizedData.push( {"Parti": element, "Count": keyCount[element]})
                });
              break;
          case "province":
              Object.keys(keyCount).forEach(element => {
                  summarizedData.push( {"Province": element, "Count": keyCount[element]})
                });
              break;
      } 
      console.log('typeInterventionCount', keyCount, summarizedData, data);
      return summarizedData;
  }


  // TODO: add description
  getInterventionsByType(data: { [key: string]: any }[], interventionType: string):{ [key: string]: any }[]{
      const filteredData: { [key: string]: any }[] = data.filter(obj => obj["typeIntervention"] === interventionType);
      return filteredData;
  }
}
