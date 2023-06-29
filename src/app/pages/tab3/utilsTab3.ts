import * as d3 from 'd3';
import { translatePretty } from "../../utils/scales"

// Renvoie le div (sous forme de string) à rajouter au DOM pour afficher le contenu du tooltip
// Note: je n'ai pas réussi à appliquer les styles en définissant juste une classe et en écrivant le style dans le csv
// donc tous les éléments de style sont présents ici
export function getTooltipContents(d:any):string{
    const tooltipDiv = d3.create('div')
      .classed('tooltip-div', true)
      .style('display','flex')
      .style('flex-direction','row')
      .style('padding', '5px')
      .style('width', '250px')
      
    const tooltipTextDiv = tooltipDiv.append('div')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('justify-content', 'space-between')
      .style('padding-left', '10px')
      .style('font-size', '1.2em')
  
      tooltipTextDiv.append('div')
      .style('font-size', '1.4em')
      .style('font-weight', '600')
      .text(d["nom"]);

      tooltipTextDiv.append('div')
        .text(translatePretty(d['KeyElement'])+" en " + translateDateToolTip(d['Date']) + ":");
    
  
      tooltipTextDiv.append('div')
        .text("• " + separateThousands(d['Count']) + " interventions").style('text-align', 'left');
        
      tooltipTextDiv.append('div')
      .text("• "+ separateThousands(d['CharCount']) + " caractères").style('text-align', 'left');
  
    const tooltipNode = tooltipDiv.node();
    if (tooltipNode) {
      return tooltipNode.outerHTML;
    }
  
    return '';
  }
function translateDateToolTip(date: string){
  const month = date.split("-")[0]
  const year = date.split("-")[1]
  const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

  return monthNames[Number(month)-1]+" "+year
}

function separateThousands(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}