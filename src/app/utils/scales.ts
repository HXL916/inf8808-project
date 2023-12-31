import * as d3 from 'd3';

export const partyColorScale = d3.scaleOrdinal() // D3 Version 4
  .domain(["BQ", "NPD", "PCC", "PLC", "PV", "Ind."])
  .range(["#159CE1", "#FF8514", "#002395" , "#ED2E38", "#30D506", "#AAAAAA"]);


export const genderColorScale = d3.scaleOrdinal() // D3 Version 4
.domain(["F", "H"])
.range(["#772A93", "#50BEB8"]);

export const provinceColorScale = d3.scaleOrdinal() // D3 Version 4
.domain(["Alberta", "Colombie-Britannique", "Manitoba", "Ontario", "Provinces maritimes", "Québec", "Saskatchewan", "Territoires"])
//.range(["#4E79A7","#F28E2C", "#59A14F", "#76B7B2", "#59A14F", "#EDC949", "#AF7AA1", "#FF9DA7"]);
.range(d3.schemeTableau10);


export const translatePretty = d3.scaleOrdinal()
.domain(["H", "F","BQ", "PCC", "PLC", "NPD", "PV", "Ind.","Alberta", "Colombie-Britannique", "Manitoba", "Ontario", "Provinces maritimes", "Québec", "Saskatchewan", "Territoires"])
.range(["Homme", "Femme", "Bloc Québécois", "Parti Conservateur", "Parti Libéral", "Nouveau Parti Démocratique","Parti Vert", "Députés indépendants","Alberta", "Colombie-Britannique", "Manitoba", "Ontario", "Provinces maritimes", "Québec", "Saskatchewan", "Territoires"]);

const monthScale = d3.scaleOrdinal()
.domain(['1','2','3','4','5','6','7','8','9','10','11','12'])
.range(['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']);

export function translateDate(input:string):string{
  let [year,month] = input.split('-')
  return monthScale(month)+" "+year
}


export const keyColors: { [key: string]: string } = {
  "H": "#50BEB8",
  "F": "#772A93",
  "BQ": "#159CE1",
  "PCC": "#002395", 
  "PLC": "#ED2E38",
  "NPD": "#FF8514",
  "PV": "#30D506",
  "Ind.": "#AAAAAA",
  "Alberta": "#edc949", 
  "Colombie-Britannique": "#e294de", 
  "Manitoba": "#9c755f", 
  "Ontario":"#c94a4c", 
  "Provinces maritimes":"#53aab1", 
  "Québec":"#124badf1", 
  "Saskatchewan":"#25bb4dde", 
  "Territoires": "#9ba1a0"
}

//Ci dessous les couleur de d3.Tableau10
//["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]

export function getColorScale(orderedKeys: string[]):d3.ScaleOrdinal<string, unknown, never>{
  let range :string[] = []
  orderedKeys.forEach(key=>{
    if (keyColors.hasOwnProperty(key)){
      range.push(keyColors[key])
    } 
    else range.push("#686868")
  })
  return d3.scaleOrdinal()
    .domain(orderedKeys)
    .range(range)
}

