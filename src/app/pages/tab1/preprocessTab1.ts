
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
 * @returns {{ [key: string]: number }}  A table of objects with keys 'parti',  containing
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
      console.log(element)
    });
    return summarizedData;
  }

  
