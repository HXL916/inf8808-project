import * as d3 from 'd3';

export const partyColorScale = d3.scaleOrdinal() // D3 Version 4
  .domain(["BQ", "PCC", "PLC", "NPD", "PV", "Ind."])
  .range(["#159CE1", "#002395" , "#ED2E38", "#FF8514", "#30D506", "#AAAAAA"]);


export const genderColorScale = d3.scaleOrdinal() // D3 Version 4
.domain(["H", "F"])
.range(["#50BEB8","#772A93"]);

export const provinceColorScale = d3.scaleOrdinal() // D3 Version 4
.domain(["Alberta", "Colombie-Britannique", "Manitoba", "Ontario", "Provinces maritimes", "Québec", "Saskatchewan", "Territoires"])
.range(["#4E79A7","#F28E2C", "#59A14F", "#76B7B2", "#59A14F", "#EDC949", "#AF7AA1", "#FF9DA7"]);


// export default { partyColorScale: partyColorScale } 