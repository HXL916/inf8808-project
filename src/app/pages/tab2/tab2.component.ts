import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as waffle from 'src/app/pages/tab2/waffle';
import * as waffle1 from 'src/app/pages/tab1/waffle';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import {
  partyColorScale,
  genderColorScale,
  getColorScale,
} from '../../utils/scales';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css'],
})
export class Tab2Component implements OnInit {
  colorScale!: any;
  wantedKey: string;
  wantedLegislature: number;
  loading: boolean = true;

  constructor(private preprocessingService: PreprocessingService) {
    this.wantedKey = 'genre';
    this.wantedLegislature = 44;
    this.colorScale = genderColorScale;
  }

  async ngOnInit() {
    try {
      await this.preprocessingService.isInitialized().toPromise();
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
    this.updateView();
  }
  updateWantedLegislature(event: Event) {
    this.wantedLegislature = Number((event.target as HTMLInputElement).value);
    this.updateView();
  }
  async updateView(): Promise<void> {
    await this.createGraph(
      this.process(this.preprocessingService.sortedData[this.wantedLegislature])
    );
    const count: { [key: string]: number } =
      this.preprocessingService.getCountByKey(
        this.preprocessingService.sortedData[this.wantedLegislature],
        this.wantedKey
      );
    this.addCountToLegend(count);
  }

  /**
   * Keeps only the MPs from the selected Legislature.
   *
   * @param {object[]} data The data to analyze
   * @returns {object[]} output The data filtered
   */
  process(data: { [key: string]: any }[]): { [key: string]: any }[] {
    switch (this.wantedKey) {
      case 'genre':
        this.colorScale = genderColorScale;
        break;
      case 'parti':
        this.colorScale = partyColorScale;
        break;
      case 'province':
        let provinces = [...new Set(data.map((obj) => obj['province']))].sort();
        this.colorScale = getColorScale(provinces);
        break;
    }

    return data.sort((x, y) =>
      d3.ascending(x[this.wantedKey], y[this.wantedKey])
    );
  }

  /**
   * Dessine le waffle chart
   *
   * @param {object[]} data The data to use
   */
  async createGraph(data: { [key: string]: any }[]): Promise<void> {
    // Draw each seat
    await waffle.drawSquares(
      data,
      '#graph-container',
      this.colorScale,
      this.wantedKey
    );

    this.lookLikeHouseOfCommons();
    await waffle1.drawWaffleLegend(this.colorScale);
  }

  /**
   * Réarrange les sièges pour donner l'allure de la Chambre des Communes avec un trou entre deux rangées.
   * Sièges supplémentaires dans une ligne supplémentaire pour députés ayant démissionné en cours de mandat.
   */
  lookLikeHouseOfCommons(nbBlocCol = 4, nbBlocRow = 5): void {
    let bigGap = 10,
      alleyGap = 20;
    for (let i = 0; i < nbBlocCol; i++) {
      for (let j = 0; j < Math.floor(nbBlocRow / 2); j++) {
        d3.selectAll(
          "rect[col='" + String(i) + "'][row='" + String(j) + "']"
        ).attr(
          'transform',
          'translate(' + String(bigGap * i) + ',' + String(bigGap * j) + ')'
        );
      }
      for (let j = Math.floor(nbBlocRow / 2); j < nbBlocRow; j++) {
        d3.selectAll(
          "rect[col='" + String(i) + "'][row='" + String(j) + "']"
        ).attr(
          'transform',
          'translate(' +
            String(bigGap * i) +
            ',' +
            String(alleyGap + bigGap * j) +
            ')'
        );
      }
    }
  }

  // Ajoute à la légende le nombre de députés dans chaque groupe / le nombre total de députés pour cette législature
  addCountToLegend(countData: { [key: string]: number }): void {
    let total: number = 0;
    for (const key in countData) {
      if (countData.hasOwnProperty(key)) {
        const value = countData[key];
        total += value;
      }
    }
    const gElements = d3
      .select('#legendContainer')
      .select('.legend')
      .selectAll('.cell');
    // Mettre à jour le texte dans chaque élément <text>.
    gElements.each(function () {
      const textElement = d3.select(this).select('text');
      const keyText = textElement.text();
      if (countData.hasOwnProperty(keyText)) {
        const newText = `${keyText} (${countData[keyText]}/${total})`;
        textElement.text(newText);
      } else {
        const newText = `${keyText} (0/${total})`;
        textElement.text(newText);
      }
    });
  }
}
