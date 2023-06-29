import * as d3 from 'd3';
import {translatePretty, translateDate } from "../../utils/scales"

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
        .text(translatePretty(d['KeyElement'])+" en"); //"+translateDate(d['xValue'])+":"); A FINIR ICI
    
  
      tooltipTextDiv.append('div')
        .text(d['Count']+" interventions");
        
      tooltipTextDiv.append('div')
      .text(d['CharCount']+" caractères dans ces interventions");
  
    const tooltipNode = tooltipDiv.node();
    if (tooltipNode) {
      return tooltipNode.outerHTML;
    }
  
    return '';
  }