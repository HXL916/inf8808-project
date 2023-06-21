
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
 * @returns { [key: string]: any }[]  A table of objects with keys 'parti',  containing
 * the name of the number of interventions for each party in the dataset
 */
export function getPartyCounts(data: { [key: string]: any }[]): { [key: string]: any }[] {
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
 * @returns { [key: string]: any }[]  A table of objects with keys 'typeIntervention',  containing
 * the name of the number of interventions for each party in the dataset
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

  const summarizedData : { [key: string]: any }[] = [];
  Object.keys(typeInterventionCount).forEach(element => {
    summarizedData.push( {"TypeIntervention": element, "Count": typeInterventionCount[element]})
  });
  return summarizedData;
}


export function getPopularInterventionTypes(summarizedData: {[key: string]: any}[]): {[key: string]: any}[]{
  const sortedData = summarizedData.sort((a, b) => b["Count"] - a["Count"]);
  const topParties = sortedData.slice(0, 6);
  // Sum the counts of the remaining parties
  const otherCount = sortedData.slice(6).reduce((sum, data) => sum + data["Count"], 0);

  // Create the new array with the top parties and the "Other" party
  const newData = [...topParties, { TypeIntervention: "Other", count: otherCount }];
  return newData;
}


export function getInterventionsLegislature(data: { [key: string]: any }[], legislature:string):{ [key: string]: any }[]{
  const filteredData: { [key: string]: any }[] = data.filter(obj => obj["legislature"] === legislature);
  return filteredData;
}


export function getMPsLegislature(listeDeputes:{ [key: string]: any }[], legislature:string){
  console.log("44")
  console.log(listeDeputes)
  const filteredData: { [key: string]: any }[] = listeDeputes.filter(obj => obj["legislature"] == legislature);
  return filteredData;
}


export function getInterstingMPs(listeDeputes:{ [key: string]: any }[], interventionsData:{ [key: string]: any }[]):any{
  const nameCounts: { [name: string]: number } = {};
  interventionsData.forEach(obj => {
    const name = obj["nom"];
    nameCounts[name] = (nameCounts[name] || 0) + 1;
  });
  
  const nameCountArray = Object.entries(nameCounts).map(([name, count]) => ({ name, count }));

  // Sort the nameCountEntries based on the count in descending order
  nameCountArray.sort((a, b) => b.count - a.count);
  
  // Get the top 3 entries
  const topEntries = nameCountArray.slice(0, 80);
  const flopEntries = nameCountArray.slice(-3);

  const listeDeputesWithCount = listeDeputes.map(obj => ({
    ...obj,
    count: nameCounts[obj["nom"]] || 0
  }));
  console.log(topEntries)
  console.log(flopEntries)
  console.log(listeDeputes)
  console.log(listeDeputesWithCount)
  return 0;
}


