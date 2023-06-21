
export function splitByLegislature(data: { [key: string]: any }[]): { [key: number]: { [key: string]: any }[] } {
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
export function getPartiesNames(data: { [key: string]: any }[]): string[] {
    return Array.from(new Set(data.map(obj => obj["Affiliation politique"]))).sort();
}


