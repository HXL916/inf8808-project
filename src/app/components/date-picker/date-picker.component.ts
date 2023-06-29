import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  @Output() filterChange = new EventEmitter<
    FormGroup<{
      start: FormControl<Date | null>;
      end: FormControl<Date | null>;
    }>
  >();
  periods = [
    '42ème législature',
    '43ème législature',
    'Pré-élections 2021',
    '44ème législature',
  ];
  selectedPeriod = this.periods[this.periods.length - 1];
  rangePickerEnabled = !this.selectedPeriod;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor() {
    this.range = this.periodRanges[3];
  }

  periodRanges: FormGroup[] = [
    new FormGroup({
      start: new FormControl<Date | null>(new Date(2015, 11, 3)), // 42ème législature
      end: new FormControl<Date | null>(new Date(2019, 8, 11)),
    }),
    new FormGroup({
      start: new FormControl<Date | null>(new Date(2019, 11, 5)), // 43ème législature
      end: new FormControl<Date | null>(new Date(2021, 7, 15)),
    }),
    new FormGroup({
      start: new FormControl<Date | null>(new Date(2021, 2, 20)), // Pré-élections 2021
      end: new FormControl<Date | null>(new Date(2021, 8, 20)),
    }),
    new FormGroup({
      start: new FormControl<Date | null>(new Date(2021, 10, 22)), // 44ème législature
      end: new FormControl<Date | null>(new Date(2023, 0, 1)),
    }),
    new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    }), // Custom range, empty
  ];

  updateRangePickerState() {
    this.rangePickerEnabled = !this.selectedPeriod;
    if (!this.rangePickerEnabled) this.range = this.periodRanges[4];
    switch (this.selectedPeriod) {
      case '42ème législature':
        this.range = this.periodRanges[0];
        this.selectedPeriod = this.periods[0];
        break;
      case '43ème législature':
        this.range = this.periodRanges[1];
        this.selectedPeriod = this.periods[1];
        break;
      case 'Pré-élections 2021':
        this.range = this.periodRanges[2];
        this.selectedPeriod = this.periods[2];
        break;
      case '44ème législature':
        this.range = this.periodRanges[3];
        this.selectedPeriod = this.periods[3];
        break;
      default:
        this.range = this.periodRanges[4];
        this.selectedPeriod = this.periods[4];
        break;
    }
    this.filterChange.emit(this.range);
  }

  updateDatePicker() {
    this.filterChange.emit(this.range);
  }
}
