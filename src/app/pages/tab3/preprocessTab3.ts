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