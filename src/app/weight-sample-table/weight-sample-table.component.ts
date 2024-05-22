import { Component, Input } from '@angular/core';
import { WeightSample } from './weight-sampling.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { DatePipe, NgIf } from '@angular/common';
import { MatChip, MatChipOption } from '@angular/material/chips';

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
    DatePipe,
    MatChipOption,
    NgIf,
    MatChip
  ],
  templateUrl: './weight-sample-table.component.html',
  styleUrl: './weight-sample-table.component.scss'
})
export class WeightSampleTableComponent {

  @Input()
  samples: WeightSample[] = [];

  displayedColumns: string[] = [
    'time',
    'weightInPounds',
    'count',
    'deltaCount',
    'deltaPounds',
    'meanWeight',
    'zScore',
    'anomalyDescription'
  ];

}
