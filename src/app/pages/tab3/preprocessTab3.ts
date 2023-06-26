// export function getInterventionsByDateRange(data: { [key: string]: any }[], startDate: string, endDate: string):{ [key: string]: any }[]{
    
//     const startDateCast = new Date(startDate);
//     const endDateCast = new Date(endDate);
    
//     // Adding 1 because months are zero-based (0 for January)
//     const startMonth = startDateCast.getMonth() + 1; 
//     const startYear = startDateCast.getFullYear();

//     const endMonth = endDateCast.getMonth() + 1; 
//     const endYear = endDateCast.getFullYear();
    
//     const filteredData: { [key: string]: any }[] = data.filter(obj => obj["année"] >= startYear && obj["année"] <= endYear).filter(obj => obj["mois"] >= startMonth && obj["mois"] <= endMonth);
//     return filteredData;
// }


export function getInterventionsByDateRange(data: { [key: string]: any }[], startDate: string, endDate: string):{ [key: string]: any }[]{
  const startDateCast = new Date(startDate)
  const endDateCast = new Date(endDate)
  console.log(startDateCast, endDateCast )

  const filteredArray = data.filter((obj) => {
    const objDate = new Date(obj["année"], obj["mois"] - 1, obj["jour"]) // attention, en objet Date de javascript, janvier=0
    return objDate >= startDateCast && objDate <= endDateCast
  });
  return filteredArray
}


export function groupInterventionByMonth(data: { [key: string]: any }[]): any {
  const groupedArrays = data.reduce<{ [key: string]: { [key: string]: any}[] }>((acc, obj) => {
    const key = `${obj["année"]}-${obj["mois"]}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
  console.log(groupedArrays)
  return groupedArrays
}



export function getTypeInterventionCounts(data: { [key: string]: any }[]): { [key: string]: any }[] {
  console.log("ici", data)
  const typeInterventionCount: { [key: string]: number } = {};
  const typeInterventionCharCount: { [key: string]: number } = {};
  for (const obj of data) {
    if (obj.hasOwnProperty('typeIntervention')) {
      const interventionType = obj['typeIntervention'];
      if (typeInterventionCount.hasOwnProperty(interventionType)) {
        typeInterventionCount[interventionType]++;
        typeInterventionCharCount[interventionType] += obj["nbCaracteres"]
      } else {
        typeInterventionCount[interventionType] = 1;
        typeInterventionCharCount[interventionType] = obj["nbCaracteres"]
      }
    }
  }

  const summarizedData : { [key: string]: any }[] = [];
  Object.keys(typeInterventionCount).forEach(element => {
    summarizedData.push( {"TypeIntervention": element, "Count": typeInterventionCount[element], "CharCount": typeInterventionCharCount[element]})
  });
  return summarizedData;
}

export function getPartiCounts(data: { [key: string]: any }[]): { [key: string]: any }[] {
  const partiCount: { [key: string]: number } = {};
  const partiCharCount: { [key: string]: number } = {};

  for (const obj of data) {
    if (obj.hasOwnProperty('parti')) {
      const parti = obj['parti'];
      if (partiCount.hasOwnProperty(parti)) {
        partiCount[parti]++;
        partiCharCount[parti] += obj["nbCaracteres"]
      } else {
        partiCount[parti] = 1;
        partiCharCount[parti] = obj["nbCaracteres"]
      }
    }
  }

  const summarizedData : { [key: string]: any }[] = [];
  Object.keys(partiCount).forEach(element => {
    summarizedData.push( {"TypeIntervention": element, "Count": partiCount[element], "CharCount": partiCharCount[element]})
  });
  return summarizedData;
}


export function getCountsWithKey(data: { [key: string]: any }[], wantedKey: string): { [key: string]: any }[] {
  const tabCount: { [key: string]: number } = {};
  const tabCharCount: { [key: string]: number } = {};

  for (const obj of data) {
    if (obj.hasOwnProperty(wantedKey)) {
      const keyElement = obj[wantedKey];
      if (tabCount.hasOwnProperty(keyElement)) {
        tabCount[keyElement]++;
        tabCharCount[keyElement] += obj["nbCaracteres"]
      } else {
        tabCount[keyElement] = 1;
        tabCharCount[keyElement] = obj["nbCaracteres"]
      }
    }
  }

  const summarizedData : { [key: string]: any }[] = [];
  Object.keys(tabCount).forEach(element => {
    summarizedData.push( {"KeyElement": element, "Count": tabCount[element], "CharCount": tabCharCount[element]})
  });
  return summarizedData;
}

export function getMaxCharCounts(groupedArrays: any): number{
  let maxSum:number = 0
  for (const key in groupedArrays) {
    if (Object.prototype.hasOwnProperty.call(groupedArrays, key)) {
      const sum = groupedArrays[key].reduce((acc: number, obj: any) => acc + obj["nbCaracteres"], 0);
      if (sum > maxSum) {
        maxSum = sum;
      }
    }
  }
  return maxSum
}

export function transformWithCumulativeCount(interventionData:{ [key: string]: any }[]):void{
  let cumulative_count:number = 0
  interventionData.forEach((d) => {
      d["Beginning"] = cumulative_count;
      cumulative_count = cumulative_count + d["CharCount"]
      d["End"] = cumulative_count;
    });
}



export function getInterventionsByDateRangeDefault(data: { [key: string]: any }[], startDate: number):{ [key: string]: any }[]{
    
    const defaultMonthBeginning: number = 1;
    const defaultMonthEnd: number = 6;
    
    
    const filteredData: { [key: string]: any }[] = data.filter(obj => obj["année"] === startDate)
    .filter(obj => obj["mois"] >= defaultMonthBeginning && obj["mois"] <= defaultMonthEnd);
    return filteredData;
}

export function getInterventionsYear(data: { [key: string]: any }[], annee:number):{ [key: string]: any }[]{
    const filteredData: { [key: string]: any }[] = data.filter(obj => obj["année"] === annee);
    return filteredData;
}

export function getInterventionsMonth(data: { [key: string]: any }[], month:number):{ [key: string]: any }[]{
    const filteredData: { [key: string]: any }[] = data.filter(obj => obj["mois"] === month);
    return filteredData;
}

export function getInterventionsByType(data: { [key: string]: any }[], interventionType: string):{ [key: string]: any }[]{
    const filteredData: { [key: string]: any }[] = data.filter(obj => obj["typeIntervention"] === interventionType);
    return filteredData;
}

// export function getInterventions(interventionsData:{ [key: string]: any }[] ){

//     let possibleMonths : number[] = [1, 2, 3, 4, 5, 6]
//     let interventionArray = []
  
//     for(let month of possibleMonths){
//       let interventionsDefault = getInterventionsByDateRangeDefault(interventionsData, 2016)
//       let interventionMonth = getInterventionsMonth(interventionsDefault, month)
  
//       // Regroupe les interventions par mois et par année
//       // C'est compliqué à comprendre le reduce avec javascript, si besoin: https://www.digitalocean.com/community/tutorials/js-finally-understand-reduce
//       const groupedArrays = interventionMonth.reduce<{ [key: string]: { [key: string]: any}[] }>((acc, obj) => {
//         const key = `${obj["année"]}-${obj["mois"]}`
//         if (!acc[key]) {
//           acc[key] = []
//         }
//         acc[key].push(obj)
//         return acc
//       }, {})
  
//       // On itère sur tous les arrays (un array = les interventions pour un mois donné)
//       for (const key in groupedArrays) {
//         if (groupedArrays.hasOwnProperty(key)) {
//           const interventionMois = groupedArrays[key];
//           // for now the year is hardcoded
//           const valeurAAJouter = getTypeInterventionCountsByPeriod(interventionMois, month, 2016);
//           interventionArray.push(valeurAAJouter)
//         }
//       }
//     }
//     return interventionArray;
// }

export function getMonth(month:number): any{ 
    var returnMonth;
    switch(month) {
        case 1: returnMonth = "January"; break;
        case 2: returnMonth = "February"; break;
        case 3: returnMonth = "March"; break;
        case 4: returnMonth = "April"; break;
        case 5: returnMonth = "May"; break;
        case 6: returnMonth = "June"; break;
        case 7: returnMonth = "July"; break;
        case 8: returnMonth = "August"; break;
        case 9: returnMonth = "September"; break;
        case 10: returnMonth = "October"; break;
        case 11: returnMonth = "November"; break;
        case 12: returnMonth = "December"; break;
     }
     return returnMonth;
  }
  
export function getCategories(data: { [key: string]: any }[], wantedKey:string): string[] {
  // Get the categories' names
  let categories: string[] = [];
  categories = data.map((obj) => obj[wantedKey]);
  // Filter it to avoid duplicates
  categories = categories.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  return categories;
}

export function getMonths(data: { [key: string]: any }[]): number[] {
  // Get the categories' names
  let categories: number[] = [];
  categories = data.map((obj) => obj['Mois']);
  // Filter it to avoid duplicates
  categories = categories.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  return categories;
}


export function getTypeInterventionCountsOfOneMonth(data: { [key: string]: any }[], month: number, year: number, wantedKey:string): { [key: string]: any }[] {
    // Keep the lines from the dates we want
    data.filter((d)=>d['années']==year).filter((d)=>d['mois']==month);

    const categories = getCategories(data, wantedKey);

    // Count the lines of each category from the remaining data
    const summarizedData : { [key: string]: number }[] = [];
    var obj : { [key: string]: number } = {};
    obj['Année'] = year;
    obj['Mois'] = month;
    for (let cat of categories){
      // Pour l'instant, compte du nombre d'interventions, pas de leur longueur
      let count = data.filter((d)=>d[wantedKey]==cat).length;
      obj[cat]= count;
    }
    summarizedData.push(obj);

    return summarizedData;
  }