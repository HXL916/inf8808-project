
export function getInterventionsByDateRange(data: { [key: string]: any }[], startDate: Date, endDate: Date):{ [key: string]: any }[]{
  console.log(startDate, endDate )

  const filteredArray = data.filter((obj) => {
    const objDate = new Date(obj["année"], obj["mois"] - 1, obj["jour"]) // attention, en objet Date de javascript, janvier=0
    return objDate >= startDate && objDate <= endDate
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

interface ObjectData {
  legislature: string;
  hansard: number;
  année: number;
  mois: number;
  jour: number;
  idIntervention: number;
  typeIntervention: string;
  nom: string;
  genre: string;
  parti: string;
  nbCaracteres: number;
  province: string;
}

export function getInterventionsByType(interventionData: { [key: string]: ObjectData[] }, wantedInterventions: string[]) {
  const filteredData: { [key: string]: ObjectData[] } = {};

  //console.log(interventionData["2021-11"])

  Object.entries(interventionData).forEach(([key, value]) => {
    const filteredItems = value.filter(item => wantedInterventions.includes(item.typeIntervention));
    if (filteredItems.length > 0) {
      filteredData[key] = filteredItems;
    }
  });

  return filteredData;
}

function getAllTypeInterventions(interventionData: { [key: string]: ObjectData[] }): string[] { // TODO: use to initialize the buttons
  const typeInterventionsSet = new Set<string>();

  // Iterate over the dataset and collect unique typeIntervention values
  Object.values(interventionData).forEach(items => {
    items.forEach(item => {
      typeInterventionsSet.add(item.typeIntervention);
    });
  });

  // Convert the Set to an array and return the result
  return Array.from(typeInterventionsSet);
}
