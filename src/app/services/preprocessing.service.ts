import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Observable, Subject,filter,forkJoin, of, take  } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

const WAFFLE_SCALE = 500;

@Injectable({
  providedIn: 'root',
})
export class PreprocessingService {
  // This service is used to preprocess the data before displaying it in the graphs
  // We use it intensively for the first page (Accueil) since all the graphs and statistics there are static
  // The following attributes store the preprocessing results and accessed in the three tabs
  parties!: string[];
  topMPs!: any;
  flopMPs!: any;
  nbInterventionsByParty!: { [key: string]: any }[];
  dataWaffle!: any[];
  popularInterventions!: { [key: string]: any; }[];
  recentInterventions!: { [key: string]: any; }[];
  deputesLegislatures!: any;
  listeDeputes44!: any;
  interestingMPs!: any;
  listeDeputes43!: any;
  increaseWomen!: string;
  changesLegislature44!: any;
  percentageActiveMP!: number;
  nbInterventionsByType!: { [key: string]: any }[];
  ranking!: { [key:string]:any}
  dataIsLoaded = new BehaviorSubject<boolean>(false);
  sortedData: any;
  debats: any;
  private initialized = false;
  private initializationSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const csv1Promise = d3.csv('./assets/data/debatsCommunesNotext.csv', d3.autoType);
    const csv2Promise = d3.csv('./assets/data/deputesLegislatures.csv', d3.autoType);
    const csv3Promise = d3.csv('./assets/data/listedeputes.csv', d3.autoType);

    try {
      forkJoin([csv1Promise, csv2Promise, csv3Promise]).subscribe(([debats, deputesLegislatures, listedeputes]) => {

        // Process the data
        this.debats = debats;
        this.nbInterventionsByParty = this.getPartyCounts(debats);
        this.parties = this.getPartiesNames(debats);
        this.dataWaffle = this.convertToWaffleCompatible(this.nbInterventionsByParty, WAFFLE_SCALE);
        this.nbInterventionsByType = this.getTypeInterventionCounts(debats);
        this.popularInterventions = this.getPopularInterventionTypes(this.nbInterventionsByType);
        this.recentInterventions = this.getInterventionsLegislature(debats, '44-1');
        
        this.deputesLegislatures = deputesLegislatures;
        this.listeDeputes44 = this.getMPsLegislature(deputesLegislatures, '44');
        this.interestingMPs = this.getInterestingMPs(this.listeDeputes44, this.recentInterventions);
        this.topMPs = this.interestingMPs['topMPs'];
        this.flopMPs = this.interestingMPs['flopMPs'];
        this.listeDeputes43 = this.getMPsLegislature(deputesLegislatures, '43');
        this.increaseWomen = this.getIncreaseWomen(this.listeDeputes43, this.listeDeputes44);
        this.percentageActiveMP = this.getPecentageActiveMP(deputesLegislatures, debats)
        this.changesLegislature44 = this.getNbChangesLegislature(listedeputes, '441');
        this.ranking = this.getRankingProvinceParty(debats)
        this.sortedData = this.splitByLegislature(this.deputesLegislatures);
        this.initialized = true;
        this.initializationSubject.next(true);
      });
    } catch (error) {
      console.error('Error occurred during service initialization:', error);
      // Handle error if needed
    }
  }

  isInitialized(): Observable<boolean> {
    if (this.initialized) {
      return of(true);
    } else {
      return this.initializationSubject.asObservable().pipe(filter((initialized: boolean) => initialized === true), take(1));
    }
  }

  

  // ######################################
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
   * @param {{ [key: string]: any }[]} data The data to analyze (interventions)
   * @returns {{ [key: string]: any }[]}  A list of js objects with keys 'parti' and 'count'
   * cointains the number of interventions for each party in the dataset
   */
  getPartyCounts(data: { [key: string]: any }[]): { [key: string]: any }[] {
    const partyCounts: { [key: string]: number } = {}; // JS object { "BQ":128, "PCC:543",...}
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
    // transform into a list of JS objects, easier to plot
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
    // transform into a list of JS objects, easier to plot
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

  getScale():number{return WAFFLE_SCALE}

  /**
   * Gets the 5 types of interventions with the most interventions, merge the others in "Autres" type
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

    // Create the new array with the top parties and the "Autres" party
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
   * Look for the most active MPs and those with few interventions
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
   * Preprocessing for stat : increase in the number of women between previous and current legislature
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
    if (increase < 0) {
      return increase.toString();
    } else { // if it's positice, we had the symbol "+"
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

  /**
 * Preprocessing for stat 1: Proportion of active MPs for each month and then average
 * 
 * @param {{ [key: string]: any }[]} listMPs the list of MPs (data we got by ourselves, deputesLegislatures)
 * @param {{ [key: string]: any }[]} interventionsData list of all the interventions
 * @returns {number} the statistic we want
 */
  getPecentageActiveMP(listMPs: { [key: string]: any}[], interventionsData:{ [key: string]: any }[] ){

    let possibleLegislature : string[] = ["42-1", "43-1", "44-1"]
    let percentageArray : number[] = []

    for(let legislature of possibleLegislature){
      let legislature_short: string = legislature.substring(0, 2)
      let interventionLegislature = this.getInterventionsLegislature(interventionsData, legislature)
      let deputesLegislatures = this.getMPsLegislature(listMPs, legislature_short)

      // Regroupe les interventions par mois et par année
      // C'est compliqué à comprendre le reduce avec javascript, si besoin: https://www.digitalocean.com/community/tutorials/js-finally-understand-reduce
      // Aussi, <{ [key: string]: { [key: string]: any}[] }> c'est le type dans groupedArray il me semble
      const groupedArrays = interventionLegislature.reduce<{ [key: string]: { [key: string]: any}[] }>((acc, obj) => {
        const key = `${obj["année"]}-${obj["mois"]}`
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(obj)
        return acc
      }, {})

      // On itère sur tous les arrays (un array = les interventions pour un mois donné)
      for (const key in groupedArrays) {
        if (groupedArrays.hasOwnProperty(key)) {
          const interventionMois = groupedArrays[key];
          // On va considérer que ce n'est pas significatif si moins de 1000 interventions dans un mois (arrive souvent vers décembre janvier)
          // Mais la plupart des autres ont entre 2000 et 4000 interventions
          if (interventionMois.length > 1000) {
            // On ajouter au tableau la proportion de députés ayant parlé
            percentageArray.push(this.getPecentageActiveMPoneMonth(deputesLegislatures, interventionMois))
          }
        }
      }
    }
    const sum = percentageArray.reduce((a, b) => a + b, 0);
    const avg = (sum / percentageArray.length) || 0;
    return Math.round(avg*1000)/10; //retourne le pourcentage avec un chiffre après la virgule
  }

  /**
   * Inside getPecentageActiveMP, get the percentage of MPs who were active for a given month
   * 
   * @param {{ [key: string]: any }[]} listMPs the list of MPs during the legislature for this month
   * @param {{ [key: string]: any }[]} interventionsMois list of all the interventions for 1 month
   * @returns {number} the statistic we want
   */
  getPecentageActiveMPoneMonth(listMPs: { [key: string]: any}[], interventionsMois:{ [key: string]: any }[] ) :number{
    // On regarde tous les noms uniques qui apparaissent dans les interventions du mois
    const uniqueNamesSet = new Set(interventionsMois.map(obj => obj["nom"]));
    // On regarde combien de députés apparaissent dans cette liste de noms (au cas où il y aurait des non-députés qui parlent)
    const matchingNames = listMPs
      .map(obj => obj["nom"])
      .filter(name => uniqueNamesSet.has(name));
    // on retourne le ratio de députés ayant parlé
    return matchingNames.length / listMPs.length
  }

  // ###########################################
  // TAB 2 PREPROCESSING FUNCTIONS


    /**
   * Takes the list of MPs with their legislature, and split it in separates lists, one for each legislature
   * 
   * @param {{ [key: string]: any }[]} data the list of MPs (deputesLegislatures)
   * @returns {{ [key: string]: any }[] } a JS object, the keys being the legislatures and the values the list of MPs for this leg
   */
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

  getCountByKey(listMPs: { [key: string]: any }[], wantedKey:string){
    return listMPs.reduce(
      (acc, obj) => {
        const key = obj[wantedKey]
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      {}
    )
  }


  //###############################
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
//  getTypeInterventionCountsByPeriod(data: { [key: string]: any }[], year: number, month: number, wantedKey: string): { [key: string]: any }[] {
  getTypeInterventionCountsByPeriod(data: { [key: string]: any }[]): { [key: string]: any }[] {
  const keyCount: { [key: string]: number } = {};

  for (const obj of data) {
    if (obj.hasOwnProperty('genre') ) {
      const key = obj['genre'];
      if (keyCount.hasOwnProperty(key)) {
          keyCount[key]++;
      } else {
          keyCount[key] = 1;
      }
    }
  }

  const summarizedData : { [key: string]: any }[] = [];
  // switch (wantedKey){
  //     case "genre":
  //         Object.keys(keyCount).forEach(element => {
  //             summarizedData.push( {"Genre": element, "Count": keyCount[element]})
  //           });
  //         break;
  //     case "parti":
  //         Object.keys(keyCount).forEach(element => {
  //             summarizedData.push( {"Parti": element, "Count": keyCount[element]})
  //           });
  //         break;
  //     case "province":
  //         Object.keys(keyCount).forEach(element => {
  //             summarizedData.push( {"Province": element, "Count": keyCount[element]})
  //           });
  //         break;
  // } 
  Object.keys(keyCount).forEach((element) => {
    summarizedData.push({ Genre: element, Count: keyCount[element] });
  });
  return summarizedData;
}


  // TODO: add description
  getInterventionsByType(data: { [key: string]: any }[], interventionType: string):{ [key: string]: any }[]{
      const filteredData: { [key: string]: any }[] = data.filter(obj => obj["typeIntervention"] === interventionType);
      return filteredData;
  }

  getRankingProvinceParty(interventionData: { [key: string]: any }[]):{ [key:string]:number} {
    const partySums: { [party: string]: number } = {};
    const provinceSums: { [region: string]: number } = {};
    // Get the sums of nb_char for each party and each province
    for (const data of interventionData) {
      const nbChar:number = data["nbCaracteres"] 
      const party:string = data["parti"]
      const province:string = data["province"]
      partySums[party] = (partySums[party] || 0) + nbChar;
      provinceSums[province] = (provinceSums[province] || 0) + nbChar;
    }
    // Sort party and region sums in descending order
    const sortedParties = Object.entries(partySums).sort(
      ([, sumA], [, sumB]) => sumB - sumA
    );
    const sortedRegions = Object.entries(provinceSums).sort(
      ([, sumA], [, sumB]) => sumB - sumA
    );
    
    // Create a new objects for rankings
    const rankingsParty: { [party: string]: number } = {};
    const rankingsProvince: { [province: string]: number } = {};
    const rankings: {[key:string]:any} = {}
    // Assign rankings to parties based on sums
    sortedParties.forEach(([party], index) => {
      rankingsParty[party] = index + 1;
    });
    // Assign rankings to regions based on sums
    sortedRegions.forEach(([region], index) => {
      rankingsProvince[region] = index + 1;
    });
    rankings["parti"] = rankingsParty
    rankings["province"] = rankingsProvince
    return rankings;
  }
}
