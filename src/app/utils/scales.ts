import * as d3 from 'd3';

/**
 * A UTILISER SUR LES CSV3
 * @param {object} data The data to be displayed
 * @returns {*} The ordinal scale used to determine the color
 */
// export function setProvinceColorScale (data) {
//     // Set scale
//     // Get all continents from the data
//     let provinces = data.map(obj => obj.Province)
//     // Filter it to avoid duplicates and put in alphabetical order
//     provinces = provinces.filter((value, index, array) => array.indexOf(value) === index)
//     provinces.sort()
//     // Create a color scale for the provinces
//     var color = d3.scaleOrdinal().domain(provinces).range(d3.schemeTableau10)
//     return color
//   }


// /**
//  * A UTILISER SUR LE CSV2
//  * @param {object} data The data to be displayed
//  * @returns {*} The ordinal scale used to determine the color
//  */
// export function setPartyColorScale (data) {
//     let parties = data.map(obj => obj.Province)
//     // Create a color scale for the provinces
//     var color = d3.scaleOrdinal().domain(provinces).range(d3.schemeTableau10)
//     return color
//   }

export const partyColorScale = d3.scaleOrdinal() // D3 Version 4
  .domain(["BQ", "PCC", "PLC", "NPD", "PV", "Ind."])
  .range(["#159CE1", "#002395" , "#ED2E38", "#FF8514", "#30D506", "#AAAAAA"]);


export const genderColorScale = d3.scaleOrdinal() // D3 Version 4
.domain(["Homme", "Femme"])
.range(["#50BEB8","#772A93"]);

export const ColorScale = d3.scaleOrdinal() // D3 Version 4
.domain(["Alberta", "Colombie-Britannique", "Manitoba", "Ontario", "Provinces maritimes", "Québec", "Saskatchewan", "Territoires"])
.range(["#4E79A7","#F28E2C", "#59A14F", "#76B7B2", "#59A14F", "#EDC949", "#AF7AA1", "#FF9DA7"]);


// export default { partyColorScale: partyColorScale } 