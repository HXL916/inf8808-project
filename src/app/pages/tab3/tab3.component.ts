import { Component, OnInit } from '@angular/core';
import { getColorScale } from '../../utils/scales';
import * as d3 from 'd3';
import * as waffle1 from 'src/app/pages/tab1/waffle';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseType } from 'd3';
import { getTooltipContents } from 'src/app/pages/tab3/utilsTab3';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css'],
})
export class Tab3Component implements OnInit {
  wantedKey!: string;
  wantedDate!: FormGroup<{
    start: FormControl<Date | null>;
    end: FormControl<Date | null>;
  }>;
  wantedInterventions!: string[];
  colorScale!: any;
  rankingPartyProvince!: { [key: string]: any };
  itemList!: any;
  color!: any;
  xScale!: any;
  yScale!: any;
  pourcent!: any;
  data: any;
  height!: number;
  loading: boolean = true;

  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey = 'genre';
    this.colorScale = getColorScale(['H', 'F']);
    this.wantedDate = new FormGroup({
      start: new FormControl<Date | null>(new Date(2021, 10, 22)),
      end: new FormControl<Date | null>(new Date(2023, 0, 1)),
    });
    this.wantedInterventions = [
      'Déclarations de députés',
      'Questions orales',
      'Affaires courantes',
      'Ordres émanant du gouvernement',
      'Recours au Règlement',
      'Travaux des subsides',
      'Affaires émanant des députés',
      'Autre',
    ];
  }

  async ngOnInit() {
    try {
      await this.preprocessingService.isInitialized().toPromise();
      this.rankingPartyProvince = this.preprocessingService.ranking;
      this.loading = false;
      this.updateView();
    } catch (error) {
      console.error(
        'Error while initializing preprocessingService on tab3: ',
        error
      );
    }
  }

  updateWantedKey(key: string): void {
    this.wantedKey = key;
    let sortedKeys;
    switch (this.wantedKey) {
      case 'genre':
        this.colorScale = getColorScale(['H', 'F']);
        break;
      case 'parti':
        sortedKeys = Object.keys(this.rankingPartyProvince['parti']).sort(
          (a, b) => {
            return (
              this.rankingPartyProvince['parti'][a] -
              this.rankingPartyProvince['parti'][b]
            );
          }
        );
        this.colorScale = getColorScale(sortedKeys);
        break;
      case 'province':
        sortedKeys = Object.keys(this.rankingPartyProvince['province']).sort(
          (a, b) => {
            return (
              this.rankingPartyProvince['province'][a] -
              this.rankingPartyProvince['province'][b]
            );
          }
        );
        this.colorScale = getColorScale(sortedKeys);
        break;
    }
    this.updateView();
  }
  updateView(): void {
    // 44ème législature
    const filterData = this.preprocessingService.getInterventionsByDateRange(
      this.preprocessingService.debats,
      this.wantedDate.value.start!,
      this.wantedDate.value.end!
    );
    let groupedArrays = this.preprocessingService.groupInterventionByMonth(filterData);
    groupedArrays = this.preprocessingService.groupSeveralMonths(groupedArrays);
    const groupedArraysByType = this.preprocessingService.getInterventionsByType(
      groupedArrays,
      this.wantedInterventions
    );
    let Ymax = this.preprocessingService.getMaxCharCounts(groupedArraysByType) / 1000000;
    const timeGroups = Object.keys(groupedArraysByType);

    this.createGraphBase(timeGroups, Ymax);
    this.generateBarChart(groupedArraysByType);
    waffle1.drawWaffleLegend(this.colorScale);
  }

  // crée la base du graph: svg element, axes, titre?
  createGraphBase(timeGroups: string[], Ymax: number): void {
    var margin = { top: 30, right: 30, bottom: 30, left: 120 },
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    this.height = height;

    // delete any old stackedBarChart so clicking updates don't append new charts
    d3.selectAll('#stackedBarChart').remove();

    // append the svg object to the body of the page
    var svg = d3
      .select('#zone-chart')
      .append('svg')
      .attr('id', 'stackedBarChart')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.xScale = d3
      .scaleBand()
      .domain(timeGroups)
      .range([0, width])
      .paddingInner(0.2);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(this.xScale).tickSizeOuter(0))
      .attr('text-anchor', 'middle')
      .selectAll('.tick text')
      .call(wrap, 50);

    this.yScale = d3.scaleLinear().domain([0, Ymax]).range([0, height]);
    const axisTitle = svg
      .append('g')
      .call(d3.axisLeft(d3.scaleLinear().domain([0, Ymax]).range([height, 0])))
      .append('text')
      .attr('class', 'axis-title')
      .attr('y', -3)
      .attr('dy', '.21em')
      .attr('text-anchor', 'beginning')
      .attr('font-size', '1.2em')
      .attr('fill', 'black')
      .text(null);
    axisTitle
      .append('tspan')
      .attr('x', -5)
      .attr('y', '0')
      .attr('dy', '-1em')
      .text('Millions de');
    axisTitle
      .append('tspan')
      .attr('x', -5)
      .attr('y', '0')
      .attr('dy', '0.2em')
      .text('caractères*');
  }
  updateLegendName(): string {
    var legend = '';
    switch (this.wantedKey) {
      case 'genre':
        legend = 'le genre';
        break;
      case 'parti':
        legend = 'le parti politique';
        break;
      case 'province':
        legend = 'la province';
        break;
    }
    return legend;
  }

  generateBarChart(groupedArrays: any): void {
    // Note: nous n'arrivons pas à utiliser d3-tip avec Angular / typescript
    // On a donc créé notre propre tooltip from scratch, mais c'est imparfait
    var tooltip = d3
      .select('#zone-chart')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.8)') // opacité du fond à 0.8
      .style('color', 'rgba(255,255,255,0.8)')
      .style('border-radius', '10px 10px 0px 10px')
      .style('padding', '5px')
      .style('pointer-events', 'none')
      .style('visibility', 'hidden');

    for (const key in groupedArrays) {
      this.generateOneBar(groupedArrays[key], key, tooltip);
    }
  }

  generateOneBar(
    interventionData: { [key: string]: any }[],
    xvalue: any,
    tooltip: any
  ): void {
    let tab: { [key: string]: any }[] = this.preprocessingService.getCountsWithKey(
      interventionData,
      this.wantedKey,
      this.rankingPartyProvince,
      xvalue
    );
    this.preprocessingService.transformWithCumulativeCount(tab);

    // on affecte a des variables locales à la fonction parce que this. dans les fonctions qu'on appelle avec d3 perd la référence au composant
    let xScale = this.xScale;
    let yScale = this.yScale;
    let colorScale = this.colorScale;
    let height = this.height;

    // on crée un groupe stackedBar par mois, on stack le intervention de ce mois dans ce groupe
    // on positionne le groupe sur l'axe des abscisses
    const container = d3
      .select('#stackedBarChart')
      .select('g')
      .append('g')
      .attr('class', 'stackedBar')
      .attr('width', 35) // a changer
      .attr('transform', `translate(${xScale(xvalue)},0)`);

    // crée toutes les zones (une par KeyElement) pour cette barre
    const stack = container
      .selectAll('.stack')
      .data(tab)
      .enter()
      .append('g')
      .attr('class', 'stack');

    // ajoute le rectangle à chaque zone
    stack
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('height', function (d) {
        return yScale(d['End'] / 1000000 - d['Beginning'] / 1000000);
      })
      .attr('y', function (d) {
        return height - yScale(d['End'] / 1000000);
      })
      .attr('width', xScale.bandwidth())
      .attr('fill', function (d) {
        return colorScale(d['KeyElement']);
      });

    d3.selectAll('.bar')
      .on('mouseover', function (event, d) {
        d3.select(this).style('stroke', 'black');
        return tooltip.style('visibility', 'visible');
      })
      .on('mousemove', function (event, d: any) {
        var x = d3.select(this).attr('x');
        var y = d3.select(this).attr('y');
        const el = document.getElementById('zone-chart') as any;
        var viewportOffset = el.getBoundingClientRect(); // positionement du graph dans le viewport
        return (
          tooltip
            //.style("top", (y+10)+"px")  // autre possibilité pour tooltip statique
            //.style("left",(x+10)+"px")
            .style('top', event.clientY - viewportOffset['y'] + 'px')
            .style('left', event.clientX - viewportOffset['x'] + 25 + 'px')
            .html(getTooltipContents(d))
        );
      })
      .on('mouseout', function () {
        d3.select(this).style('stroke', 'none'); // remet le siège sélectionné à la normale
        return tooltip.style('visibility', 'hidden');
      });
  }

  updateDateFilter(
    date: FormGroup<{
      start: FormControl<Date | null>;
      end: FormControl<Date | null>;
    }>
  ) {
    if (date.value.start && date.value.end) {
      this.wantedDate = date;
      this.updateView();
    }
  }

  updateInterventionTypes(interventionTypes: string[]) {
    this.wantedInterventions = interventionTypes;
    this.updateView();
  }
}

function wrap(
  text: d3.Selection<BaseType, unknown, SVGGElement, any>,
  width: number
) {
  text.each(function (this: BaseType, d) {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line: any = [];
    const lineHeight = 1.1; // Ajuster cette valeur pour la hauteur désirée entre les lignes
    const x = text.attr('x') || 0;
    const y = text.attr('y') || 0;
    const dy = parseFloat(text.attr('dy') || '0');
    const maxLines = 2;

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

    if (lineCount >= maxLines) {
      // Rajouter le texte de la troisième ligne à la deuxième ligne
      const secondLineTspan = text.selectAll('tspan').filter(':nth-child(2)');
      const thirdLineTspan = text.selectAll('tspan').filter(':nth-child(3)');
      secondLineTspan.text(
        secondLineTspan.text() + ' ' + thirdLineTspan.text()
      );
      thirdLineTspan.remove();
    }
  });
}
