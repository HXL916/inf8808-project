// Pretty much all the functions here have been moved to the service
// week it here as an archive if needed


/**
 * Gets the names of the political parties (as written in debatsCommunes.csv).
 *
 * @param {object[]} data The data to analyze
 * @returns {string[]} The names of the parties in the data set
 */
export function getPartiesNames(data: { [key: string]: any }[]): string[] {
    let parties: string[] = [];
    parties = data.map(obj => obj['parti'])
  // Filter it to avoid duplicates
    parties = parties.filter((value, index, array) => array.indexOf(value) === index)
    return parties;
}



/**
 * Gets the number of intervention for each political party.
 *
 * @param {{ [key: string]: any }[]} data The data to analyze
 * @returns {{ [key: string]: any }[]}  A list of js objects with keys 'parti' and 'count'
 * cointains the number of interventions for each party in the dataset
 */
export function getPartyCounts(data: { [key: string]: any }[]): { [key: string]: any }[] {
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
  const summarizedData : { [key: string]: any }[] = [];
  Object.keys(partyCounts).forEach(element => {
    summarizedData.push( {"Parti": element, "Count": partyCounts[element]})
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
export function getTypeInterventionCounts(data: { [key: string]: any }[]): { [key: string]: any }[] {
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
  const summarizedData : { [key: string]: any }[] = [];
  Object.keys(typeInterventionCount).forEach(element => {
    summarizedData.push( {"TypeIntervention": element, "Count": typeInterventionCount[element]})
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
export function   convertToWaffleCompatible( data: { [key: string]: any }[], scale:number): any[] {
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



/**
 * Gets the 5 types of interventions with the most intervention, merge the others in "Autres" type
 * 
 * @param {{[key: string]: any}[]} summarizedData The data to analyze, has to have keys 'TypeIntervention' and 'Count' for each object
 * @returns {string[]} An array of objects like in summerizedData, but with only top 6 TypeIntervention + 'Autres'
 */
export function getPopularInterventionTypes(summarizedData: {[key: string]: any}[]): {[key: string]: any}[]{
  const sortedData = summarizedData.sort((a, b) => b["Count"] - a["Count"]);
  const topParties = sortedData.slice(0, 6);
  // Sum the counts of the remaining parties
  const otherCount = sortedData.slice(6).reduce((sum, data) => sum + data["Count"], 0);

  // Create the new array with the top parties and the "Autres" party
  const newData = [...topParties, { TypeIntervention: "Autres", Count: otherCount }];
  return newData;
}



/**
 * Filter the data to keep only the interventions for a specified legislature
 * 
 * @param {{ [key: string]: any }[]} data The data to analyze (list of interventions)
 * @param {string} legislature The legislature to keep
 * @returns {{ [key: string]: any }[]} A filtered list of interventions
 */
export function getInterventionsLegislature(data: { [key: string]: any }[], legislature:string):{ [key: string]: any }[]{
  const filteredData: { [key: string]: any }[] = data.filter(obj => obj["legislature"] === legislature);
  return filteredData;
}


/**
 * Filter the list of MPs to keep only the MPs for a specified legislature
 * 
 * @param {{ [key: string]: any }[]} listeDeputes The data to analyze (list of MPs)
 * @param {string} legislature The legislature to keep
 * @returns {{ [key: string]: any }[]} A filtered list of MPs
 */
export function getMPsLegislature(listeDeputes:{ [key: string]: any }[], legislature:string): { [key: string]: any }[]{
  const filteredData: { [key: string]: any }[] = listeDeputes.filter(obj => obj["legislature"] == legislature);
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
export function getInterstingMPs(listeDeputes:{ [key: string]: any }[], interventionsData:{ [key: string]: any }[]):any{
  const nameCounts: { [name: string]: number } = {};
  interventionsData.forEach(obj => {
    const name = obj["nom"];
    nameCounts[name] = (nameCounts[name] || 0) + 1;
  });
  
  const listeDeputesWithCount = listeDeputes.map(obj => ({
    ...obj,
    count: nameCounts[obj["nom"]] || 0
  }));
  // sort by count value
  listeDeputesWithCount.sort((a, b) => b.count - a.count);
  // Get the top 3 entries with the highest values for "count"
  const topEntries = listeDeputesWithCount.slice(0, 3);
  // Get the 3 entries with the lowest values for "count"
  const lowestEntries = listeDeputesWithCount.slice(-3)
  const result:{[name: string]: any} = {"topMPs": topEntries, "flopMPs": lowestEntries}
  return result;
}


/**
 * Preprocessing for stat : increase in the number of women  between previous and current legislature
 * 
 * @param {{ [key: string]: any }[]} previousMPs the list of MPs (for one legislature)
 * @param {{ [key: string]: any }[]} newMPs the list of MPs (for another legislature)
 * @returns {string} A string representing the number (+8, -9, ...), to inject in the DOM
 */
export function getIncreaseWomen(previousMPs:{ [key: string]: any }[], newMPs:{ [key: string]: any }[]):string{
  const previousNumberOfWomen:number = previousMPs.filter(obj => obj["genre"] === "F").length;
  const newNumberOfWomen:number = newMPs.filter(obj => obj["genre"] === "F").length;
  const increase:number = newNumberOfWomen - previousNumberOfWomen;
  if(increase<0){
    return increase.toString();
  }
  else{ // if it's positice, we had the symbol "+"
    return "+"+increase.toString();
  }
}


/**
 * Preprocessing for stat : number of changes since the beginning of this legislature
 * 
 * @param {{ [key: string]: any }[]} listMPs the list of MPs (data from Jean Hugues, with the changes)
 * @param {{ [key: string]: any }[]} legislature legislature where the changes happened
 * @returns {{[key: string]: any }[]} An array with all the changes. We can get the number after the preprocessing with array.length
 */
export function getNbChangesLegislature(listMPs: { [key: string]: any }[], legislature:string):{ [key: string]: any }[]{
  const filteredData: { [key: string]: any }[] = listMPs.filter(obj => obj["ch1-legislature"] == legislature);
  return filteredData
}


/**
 * Preprocessing for stat 1: Proportion of active MPs for each month and then average
 * 
 * @param {{ [key: string]: any }[]} listMPs the list of MPs (data we got by ourselves, deputesLegislatures)
 * @param {{ [key: string]: any }[]} interventionsData list of all the interventions
 * @returns {number} the statistic we want
 */
export function getPecentageActiveMP(listMPs: { [key: string]: any}[], interventionsData:{ [key: string]: any }[] ){

  let possibleLegislature : string[] = ["42-1", "43-1", "44-1"]
  let percentageArray : number[] = []

  for(let legislature of possibleLegislature){
    let legislature_short: string = legislature.substring(0, 2)
    let interventionLegislature = getInterventionsLegislature(interventionsData, legislature)
    let deputesLegislatures = getMPsLegislature(listMPs, legislature_short)

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
          percentageArray.push(getPecentageActiveMPoneMonth(deputesLegislatures, interventionMois))
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
function getPecentageActiveMPoneMonth(listMPs: { [key: string]: any}[], interventionsMois:{ [key: string]: any }[] ) :number{
  // On regarde tous les noms uniques qui apparaissent dans les interventions du mois
  const uniqueNamesSet = new Set(interventionsMois.map(obj => obj["nom"]));
  // On regarde combien de députés apparaissent dans cette liste de noms (au cas où il y aurait des non-députés qui parlent)
  const matchingNames = listMPs
    .map(obj => obj["nom"])
    .filter(name => uniqueNamesSet.has(name));
  // on retourne le ratio de députés ayant parlé
  return matchingNames.length / listMPs.length
}
