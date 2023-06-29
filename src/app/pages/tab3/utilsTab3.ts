import * as d3 from 'd3';
import { translatePretty } from '../../utils/scales';

// Renvoie le div (sous forme de string) à rajouter au DOM pour afficher le contenu du tooltip
export function getTooltipContents(d: any): string {
  const tooltipDiv = d3
    .create('div')
    .classed('tooltip-div', true)
    .style('display', 'flex')
    .style('flex-direction', 'row')
    .style('padding', '5px')
    .style('width', '250px');

  const tooltipTextDiv = tooltipDiv
    .append('div')
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('justify-content', 'space-between')
    .style('padding-left', '10px')
    .style('font-size', '1.2em');

  tooltipTextDiv
    .append('div')
    .style('font-size', '1.4em')
    .style('font-weight', '600')
    .text(d['nom']);

  tooltipTextDiv
    .append('div')
    .text(
      translatePretty(d['KeyElement']) +
        ' en ' +
        translateDateToolTip(d['Date']) +
        ':'
    );

  tooltipTextDiv
    .append('div')
    .text('• ' + separateThousands(d['Count']) + ' interventions')
    .style('text-align', 'left');

  tooltipTextDiv
    .append('div')
    .text('• ' + separateThousands(d['CharCount']) + ' caractères')
    .style('text-align', 'left');

  const tooltipNode = tooltipDiv.node();
  if (tooltipNode) {
    return tooltipNode.outerHTML;
  }

  return '';
}

// Fonction pour enlever les abréviations de mois dans les dates à afficher en tooltip
function translateDateToolTip(date: string) {
  // Pour toutes les abréviations de mois utilisées, on associe le mot entier
  const monthFullNames: { [key: string]: string } = {
    Jan: 'Janvier',
    Fev: 'Février',
    Avr: 'Avril',
    Juil: 'Juillet',
    Sep: 'Septembre',
    Oct: 'Octobre',
    Nov: 'Novembre',
    Dec: 'Décembre',
  };
  let finalDate: string = '';
  console.log(date);
  if (date.includes('-')) {
    // Si on a groupé plusieurs mois
    const date1 = date.split('-')[0];
    const date2 = date.split('-')[1];
    // Pour chacune des 2 dates, on va transformer l'abréviation du mois en nom de mois entier (si mois abrégé)
    date1.split(' ').forEach((part) => {
      if (monthFullNames.hasOwnProperty(part))
        finalDate += monthFullNames[part];
      else finalDate += part;
      finalDate += ' ';
    });
    finalDate += '-'; // On sépare les deux dates par un -
    date2.split(' ').forEach((part) => {
      finalDate += ' ';
      if (monthFullNames.hasOwnProperty(part))
        finalDate += monthFullNames[part];
      else finalDate += part;
    });
  } else {
    // On a qu'un seul mois. Si le mois est abrégé, on met le mot entier et on garde l'année telle quelle
    date.split(' ').forEach((part) => {
      if (monthFullNames.hasOwnProperty(part))
        finalDate += monthFullNames[part];
      else finalDate += part;
      finalDate += ' ';
    });
  }
  return finalDate.toLocaleLowerCase();
}

function separateThousands(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
