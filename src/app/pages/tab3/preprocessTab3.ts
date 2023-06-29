export function getInterventionsByDateRange(
  data: { [key: string]: any }[],
  startDate: Date,
  endDate: Date
): { [key: string]: any }[] {

  const filteredArray = data.filter((obj) => {
    const objDate = new Date(obj['année'], obj['mois'] - 1, obj['jour']); // attention, en objet Date de javascript, janvier=0
    return objDate >= startDate && objDate <= endDate;
  });
  return filteredArray;
}

export function groupInterventionByMonth(data: { [key: string]: any }[]): any {
  const groupedArrays = data.reduce<{
    [key: string]: { [key: string]: any }[];
  }>((acc, obj) => {
    const key = `${obj['année']}-${obj['mois']}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
  return groupedArrays;
}

export function groupSeveralMonths(data: { [key: string]: any }): {
  [key: string]: any;
} {
  let groupedData: { [key: string]: any[] } = {};
  const months = Object.keys(data);

  const step: number = Math.max(1, Math.ceil((months.length - 6) / 12));
  for (let i = 0; i < months.length; i += step) {
    const group = months.slice(i, i + step);
    const groupKey = `${group[0]} ${group[group.length - 1]}`;
    const groupValues: any[] = [];

    for (const month of group) {
      if (data.hasOwnProperty(month)) {
        groupValues.push(...data[month]);
      }
    }

    groupedData[groupKey] = groupValues;
  }
  groupedData = simplifyKeyNames(groupedData);
  return groupedData;
}

function simplifyKeyNames(data: { [key: string]: any }): {
  [key: string]: any;
} {
  const simplifiedData: { [key: string]: any } = {};
  const monthTranslate: { [key: number]: string } = {
    1: 'Jan',
    2: 'Fev',
    3: 'Mars',
    4: 'Avr',
    5: 'Mai',
    6: 'Juin',
    7: 'Juil',
    8: 'Aout',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const [startDate, endDate] = key.split(' ');

      const [startYear, startMonth] = startDate.split('-');
      const [endYear, endMonth] = endDate.split('-');

      const startMonthName = monthTranslate[parseInt(startMonth)];
      const endMonthName = monthTranslate[parseInt(endMonth)];

      if (startYear === endYear) {
        if (startMonth === endMonth) {
          const simplifiedKey = `${startMonthName} ${startYear}`;
          simplifiedData[simplifiedKey] = data[key];
        } else {
          const simplifiedKey = `${startMonthName}-${endMonthName} ${startYear}`;
          simplifiedData[simplifiedKey] = data[key];
        }
      } else {
        const simplifiedKey = `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
        simplifiedData[simplifiedKey] = data[key];
      }
    }
  }
  return simplifiedData;
}

export function getCountsWithKey(
  data: { [key: string]: any }[],
  wantedKey: string,
  ranking: {[key: string]:any},
  date: any
): { [key: string]: any }[] {
  const tabCount: { [key: string]: number } = {};
  const tabCharCount: { [key: string]: number } = {};
  for (const obj of data) {
    if (obj.hasOwnProperty(wantedKey)) {
      const keyElement = obj[wantedKey];
      if (tabCount.hasOwnProperty(keyElement)) {
        tabCount[keyElement]++;
        tabCharCount[keyElement] += obj['nbCaracteres'];
      } else {
        tabCount[keyElement] = 1;
        tabCharCount[keyElement] = obj['nbCaracteres'];
      }
    }
  }

  // Define the specific order of keys
  // const specificOrder = [
  //   "H",
  //   "F",
  //   "PCC",
  //   "NPD",
  //   "PLC",
  //   "BQ",
  //   "PV",
  //   "Ind.",
  //   "Québec",
  //   "Ontario",
  //   "Colombie-Britannique",
  //   "Alberta",
  //   "Provinces maritimes",
  //   "Manitoba",
  //   "Saskatchewan",
  //   "Territoires"
  // ];
  let specificOrder:string[]
  if(wantedKey=="genre") specificOrder = ["H","F"]
  else{
    specificOrder = Object.keys(ranking[wantedKey]).sort((a, b) => {
      return ranking[wantedKey][a] - ranking[wantedKey][b];
    });
  }

  // Here we order the tabCount object based on the specific order of keys
  const summarizedData: { [key: string]: any }[] = [];
  specificOrder.forEach((element) => {
    if (tabCount.hasOwnProperty(element)) {
      summarizedData.push({
        "KeyElement": element,
        "Count": tabCount[element],
        "CharCount": tabCharCount[element],
        "Date": date
      });
    }
  });
  return summarizedData;
}

export function getMaxCharCounts(groupedArrays: any): number {
  let maxSum: number = 0;
  for (const key in groupedArrays) {
    if (Object.prototype.hasOwnProperty.call(groupedArrays, key)) {
      const sum = groupedArrays[key].reduce(
        (acc: number, obj: any) => acc + obj['nbCaracteres'],
        0
      );
      if (sum > maxSum) {
        maxSum = sum;
      }
    }
  }
  return maxSum;
}

export function transformWithCumulativeCount(
  interventionData: { [key: string]: any }[]
): void {
  let cumulative_count: number = 0;
  interventionData.forEach((d) => {
    d['Beginning'] = cumulative_count;
    cumulative_count = cumulative_count + d['CharCount'];
    d['End'] = cumulative_count;
  });
}

export interface ObjectData {
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

export function getInterventionsByType(
  interventionData: { [key: string]: ObjectData[] },
  wantedInterventions: string[]
) {
  const filteredData: { [key: string]: ObjectData[] } = {};


  Object.entries(interventionData).forEach(([key, value]) => {
    const filteredItems = value.filter((item) =>
      wantedInterventions.includes(item.typeIntervention)
    );
    if (filteredItems.length > 0) {
      filteredData[key] = filteredItems;
    }
  });

  return filteredData;
}

function getAllTypeInterventions(interventionData: {
  [key: string]: ObjectData[];
}): string[] {
  // TODO: use to initialize the buttons
  const typeInterventionsSet = new Set<string>();

  // Iterate over the dataset and collect unique typeIntervention values
  Object.values(interventionData).forEach((items) => {
    items.forEach((item) => {
      typeInterventionsSet.add(item.typeIntervention);
    });
  });

  // Convert the Set to an array and return the result
  return Array.from(typeInterventionsSet);
}
