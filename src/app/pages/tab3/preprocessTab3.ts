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

export function getInterventionsByType(data: { [key: string]: any }[], interventionType: string):{ [key: string]: any }[]{
    const filteredData: { [key: string]: any }[] = data.filter(obj => obj["typeIntervention"] === interventionType);
    return filteredData;
}

// export function getPecentageActiveMP(listMPs: { [key: string]: any}[], interventionsData:{ [key: string]: any }[] ){

//     let possibleLegislature : string[] = ["42-1", "43-1", "44-1"]
//     let percentageArray : number[] = []
  
//     for(let legislature of possibleLegislature){
//       let legislature_short: string = legislature.substring(0, 2)
//       console.log(legislature_short)
//       let interventionLegislature = getInterventionsLegislature(interventionsData, legislature)
//       let deputesLegislatures = getMPsLegislature(listMPs, legislature_short)
//       console.log(interventionLegislature, deputesLegislatures)
  
//       // Regroupe les interventions par mois et par année
//       // C'est compliqué à comprendre le reduce avec javascript, si besoin: https://www.digitalocean.com/community/tutorials/js-finally-understand-reduce
//       // Aussi, <{ [key: string]: { [key: string]: any}[] }> c'est le type dans groupedArray il me semble
//       const groupedArrays = interventionLegislature.reduce<{ [key: string]: { [key: string]: any}[] }>((acc, obj) => {
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
//           // On va considérer que ce n'est pas significatif si moins de 1000 interventions dans un mois (arrive souvent vers décembre janvier)
//           // Mais la plupart des autres ont entre 2000 et 4000 interventions
//           if (interventionMois.length > 1000) {
//             // On ajouter au tableau la proportion de députés ayant parlé
//             percentageArray.push(getPecentageActiveMPoneMonth(deputesLegislatures, interventionMois))
//           }
//         }
//       }
//     }
//     const sum = percentageArray.reduce((a, b) => a + b, 0);
//     const avg = (sum / percentageArray.length) || 0;
//     return Math.round(avg*1000)/10; //retourne le pourcentage avec un chiffre après la virgule
//   }