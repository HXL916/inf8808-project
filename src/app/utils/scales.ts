import * as d3 from 'd3';

export const partyColorScale = d3.scaleOrdinal() // D3 Version 4
  .domain(["BQ", "PCC", "PLC", "NPD", "PV", "Ind."])
  .range(["#159CE1", "#002395" , "#ED2E38", "#FF8514", "#30D506", "#AAAAAA"]);


export const genderColorScale = d3.scaleOrdinal() // D3 Version 4
.domain(["H", "F"])
.range(["#50BEB8","#772A93"]);

export const provinceColorScale = d3.scaleOrdinal() // D3 Version 4
.domain(["Alberta", "Colombie-Britannique", "Manitoba", "Ontario", "Provinces maritimes", "Québec", "Saskatchewan", "Territoires"])
//.range(["#4E79A7","#F28E2C", "#59A14F", "#76B7B2", "#59A14F", "#EDC949", "#AF7AA1", "#FF9DA7"]);
.range(d3.schemeTableau10);


export const translatePretty = d3.scaleOrdinal()
.domain(["H", "F","BQ", "PCC", "PLC", "NPD", "PV", "Ind.","Alberta", "Colombie-Britannique", "Manitoba", "Ontario", "Provinces maritimes", "Québec", "Saskatchewan", "Territoires"])
.range(["Homme", "Femme", "Bloc Québécois", "Parti Conservateur", "Parti Libéral", "Nouveau Parti Démocratique","Parti Vert", "Indépendantistes","Alberta", "Colombie-Britannique", "Manitoba", "Ontario", "Provinces maritimes", "Québec", "Saskatchewan", "Territoires"]);

const monthScale = d3.scaleOrdinal()
.domain(['1','2','3','4','5','6','7','8','9','10','11','12'])
.range(['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']);

export function translateDate(input:string):string{
  console.log(input)
  let [year,month] = input.split('-')
  return monthScale(month)+" "+year
}