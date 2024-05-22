import { Component, Input } from '@angular/core';
import { WeightSample } from '../scale/weight-sampling.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-weight-sample-table',
  standalone: true,
  imports: [
    MatHeaderCellDef,
    MatCellDef,
    MatRowDef,
    MatHeaderRowDef,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    DatePipe
  ],
  templateUrl: './weight-sample-table.component.html',
  styleUrl: './weight-sample-table.component.scss'
})
export class WeightSampleTableComponent {

  @Input()
  samples: WeightSample[] = [];

  @Input()
  lowerThreshold: number | undefined;

  @Input()
  upperThreshold: number | undefined;

  displayedColumns: string[] = ['time', 'weightInPounds', 'count', 'deltaCount', 'deltaPounds', 'meanWeight', 'warn'];

  warning(v: number): string | void {
    if (this.upperThreshold && v > this.upperThreshold) {
      return 'over'
    }
    if (this.lowerThreshold && v < this.lowerThreshold) {
      return 'under'
    }
  }
}
