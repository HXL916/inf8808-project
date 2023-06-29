import { Component, Injectable, Output, EventEmitter } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY} from '@angular/material/datepicker';

// @Injectable()
// export class HalfYearRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
//   constructor(private _dateAdapter: DateAdapter<D>) {}

//   selectionFinished(date: D | null): DateRange<D> {
//     return this._createHalfYearRange(date);
//   }

//   createPreview(activeDate: D | null): DateRange<D> {
//     return this._createHalfYearRange(activeDate);
//   }

//   private _createHalfYearRange(date: D | null): DateRange<D> {
//     if (date) {
//       const start = this._dateAdapter.addCalendarDays(date, 0);
//       const end = this._dateAdapter.addCalendarDays(date, 182);
//       return new DateRange<D>(start, end);
//     }

//     return new DateRange<D>(null, null);
//   }
// }

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  // providers: [
  //   {
  //     provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
  //     useClass: HalfYearRangeSelectionStrategy,
  //   }
  // ],
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {
  @Output() filterChange = new EventEmitter<FormGroup<{ start: FormControl<Date | null>; end: FormControl<Date | null>; }>>();
  periods = ["42ème législature", "43ème législature", "Pré-élections 2021", "44ème législature"];
  selectedPeriod = this.periods[this.periods.length - 1];
  rangePickerEnabled = !this.selectedPeriod;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  constructor() {
    this.range = this.periodRanges[3];
  }

  periodRanges: FormGroup[] = [
    new FormGroup({
      start: new FormControl<Date | null>(new Date(2015, 11, 3)), // 42ème législature
      end: new FormControl<Date | null>(new Date(2019, 8, 11))
    }),
    new FormGroup({
      start: new FormControl<Date | null>(new Date(2019, 11, 5)), // 43ème législature
      end: new FormControl<Date | null>(new Date(2021, 7, 15))
    }),
    new FormGroup({
      start: new FormControl<Date | null>(new Date(2021, 2, 20)), // Pré-élections 2021
      end: new FormControl<Date | null>(new Date(2021, 8, 20))
    }),
    new FormGroup({
      start: new FormControl<Date | null>(new Date(2021, 10, 22)), // 44ème législature
      end: new FormControl<Date | null>(new Date(2023, 0, 1))
    }),
    new FormGroup({start: new FormControl<Date | null>(null), end: new FormControl<Date | null>(null)}) // Custom range, empty
  ];

  updateRangePickerState() {
    this.rangePickerEnabled = !this.selectedPeriod;   
    if(!this.rangePickerEnabled) this.range = this.periodRanges[4];
    switch (this.selectedPeriod) {
      case "42ème législature":
        this.range = this.periodRanges[0];
        this.selectedPeriod = this.periods[0];
        break;
      case "43ème législature":
        this.range = this.periodRanges[1];
        this.selectedPeriod = this.periods[1];
        break;
      case "Pré-élections 2021":
        this.range = this.periodRanges[2];
        this.selectedPeriod = this.periods[2];
        break;
      case "44ème législature":
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