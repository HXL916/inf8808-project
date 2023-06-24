export function getInterventionsByDateRange(data: { [key: string]: any }[], startDate: string, endDate: string):{ [key: string]: any }[]{
    
    const startDateCast = new Date(startDate);
    const endDateCast = new Date(endDate);
    
    // Adding 1 because months are zero-based (0 for January)
    const startMonth = startDateCast.getMonth() + 1; 
    const startYear = startDateCast.getFullYear();

    const endMonth = endDateCast.getMonth() + 1; 
    const endYear = endDateCast.getFullYear();
    
    const filteredData: { [key: string]: any }[] = data.filter(obj => obj["année"] >= startYear && obj["année"] <= endYear).filter(obj => obj["mois"] >= startMonth && obj["mois"] <= endMonth);
    return filteredData;
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

export function getInterventions(interventionsData:{ [key: string]: any }[] ){

    let possibleMonths : number[] = [1, 2, 3, 4, 5, 6]
    let interventionArray = []
  
    for(let month of possibleMonths){
    //   console.log(legislature_short)
      let interventionsDefault = getInterventionsByDateRangeDefault(interventionsData, 2016)
      let interventionMonth = getInterventionsMonth(interventionsDefault, month)
      console.log( 'YANNICK ',interventionsDefault, interventionMonth)
  
      // Regroupe les interventions par mois et par année
      // C'est compliqué à comprendre le reduce avec javascript, si besoin: https://www.digitalocean.com/community/tutorials/js-finally-understand-reduce
      const groupedArrays = interventionMonth.reduce<{ [key: string]: { [key: string]: any}[] }>((acc, obj) => {
        const key = `${obj["année"]}-${obj["mois"]}`
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(obj)
        return acc
      }, {})
  
      // On itère sur tous les arrays (un array = les interventions pour un mois donné)
      for (const key in groupedArrays) {
        // if (groupedArrays.hasOwnProperty(key)) {
          const interventionMois = groupedArrays[key];
          const valeurAAJouter = getTypeInterventionCountsByPeriod(interventionMois);
          // je vais peut être la changer pour recevoir les bonnes infos
          interventionArray.push(valeurAAJouter)
        // }
      }
    }
    console.log("interventionARRAY: " + interventionArray)
    return interventionArray
  }

  export function getTypeInterventionCountsByPeriod(data: { [key: string]: any }[]): { [key: string]: any }[] {
    const keyCount: { [key: string]: number } = {};
  
    console.log('i am inside getTypeInterventionCountsByPeriod', data);
    for (const obj of data) {
      if (obj.hasOwnProperty('genre') ) {
        const key = obj['genre'];
        if (keyCount.hasOwnProperty(key)) {
            keyCount[key]++;
        } else {
            keyCount[key] = 1;
        }
      }
    }
  
    const summarizedData : { [key: string]: any }[] = [];
    Object.keys(keyCount).forEach((element) => {
      summarizedData.push({ Genre: element, Count: keyCount[element] });
    });
    console.log('typeInterventionCount', keyCount, summarizedData, data);
    return summarizedData;
  }