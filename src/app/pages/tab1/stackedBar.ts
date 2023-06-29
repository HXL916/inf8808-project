import * as d3 from 'd3';

export function createStackedBarChart(
  popularinterventions: { [key: string]: any }[]
): void {
  const margin = { top: 10, right: 0, bottom: 10, left: 30 };
  const width = 1000 - margin.left - margin.right;
  const height = 150 - margin.top - margin.bottom;

  const svg = d3
    .select('#stackedBarChart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  let xMax: number = 0;
  for (const obj of popularinterventions) {
    xMax += obj['Count'];
  }
  let cumulative_count: number = 0;
  popularinterventions.forEach((d) => {
    d['Beginning'] = cumulative_count;
    cumulative_count = cumulative_count + d['Count'];
    d['End'] = cumulative_count;
    d['Percentage'] = Math.round((d['Count'] / xMax) * 1000) / 10;
  });

  const types: string[] = popularinterventions.map(
    (obj) => obj['TypeIntervention']
  );
  const x = d3.scaleLinear().domain([0, xMax]).range([0, width]);

  const colorScale: any = d3
    .scaleOrdinal()
    .domain(types)
    .range(d3.schemeTableau10);

  const stack = svg
    .selectAll('.stack')
    .data(popularinterventions)
    .enter()
    .append('g')
    .attr('class', 'stack')
    .attr('transform', (d) => `translate(${x(d['Beginning'])}, 0)`);

  stack
    .append('rect')
    .attr('x', 0)
    .attr('width', function (d) {
      return x(d['End'] - d['Beginning']);
    })
    .attr('height', height)
    .attr('fill', function (d) {
      return colorScale(d['TypeIntervention']);
    });

  //Ajoute type d'interventions
  stack
    .append('text')
    .attr('x', (d) => x(d['End'] - d['Beginning']) / 2)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text((d) => d['TypeIntervention'])
    .call(wrap, 45);

  //Ajoute pourcentage d'interventions
  stack
    .append('text')
    .attr('x', (d) => x(d['End'] - d['Beginning']) / 2)
    .attr('y', height - 20)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-weight', 'bold')
    .text((d) => d['Percentage'] + '%');
}

function wrap(
  text: d3.Selection<
    SVGTextElement,
    { [key: string]: any },
    SVGGElement,
    unknown
  >,
  width: number
) {
  text.each(function (this: SVGTextElement, d) {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line: any = [];
    const lineHeight = 1.1; // Adjust this value for desired line height
    const x = text.attr('x');
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy') || '0');
    const maxLines = 4;

    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', dy + 'em');

    let lineCount = 0;

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node()!.getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineCount * lineHeight + dy + 'em')
          .text(word);
      }
    }

    // Check if the maximum number of lines is reached
    if (lineCount >= maxLines) {
      // Append "..." at the end of the last line
      const lastTspan = text.selectAll('tspan').filter(':last-child');
      const lastLineText = lastTspan.text();
      const truncatedText =
        lastLineText.slice(0, lastLineText.length - 3) + '...';
      lastTspan.text(truncatedText);
    }
  });
}
