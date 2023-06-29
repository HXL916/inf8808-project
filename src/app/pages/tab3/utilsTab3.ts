import * as d3 from 'd3';
import { translatePretty } from '../../utils/scales';

// Send back the div (as a string) to add to the DOM to display the tooltip content
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

// Function to remove month abbreviations in dates to display in tooltip
function translateDateToolTip(date: string) {
  // For every month abbreviation used, we associate the full word
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
  if (date.includes('-')) {
    // If we grouped multiple months
    const date1 = date.split('-')[0];
    const date2 = date.split('-')[1];
    // For every 2 dates, we transform the month abbreviation into the full month name (if abbreviated)
    date1.split(' ').forEach((part) => {
      if (monthFullNames.hasOwnProperty(part))
        finalDate += monthFullNames[part];
      else finalDate += part;
      finalDate += ' ';
    });
    finalDate += '-'; // Separator between the 2 dates
    date2.split(' ').forEach((part) => {
      finalDate += ' ';
      if (monthFullNames.hasOwnProperty(part))
        finalDate += monthFullNames[part];
      else finalDate += part;
    });
  } else {
    // If we only have one month, we transform the month abbreviation into the full month name (if abbreviated)
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
