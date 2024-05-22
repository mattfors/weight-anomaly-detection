import { Component } from '@angular/core';
import { ScaleService } from './scale.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { WeightSample, WeightSamplingService } from './weight-sampling.service';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatChip } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { WeightSampleTableComponent } from '../weight-sample-table/weight-sample-table.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-scale',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    NgIf,
    MatChip,
    MatProgressSpinner,
    WeightSampleTableComponent,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './scale.component.html',
  styleUrl: './scale.component.scss'
})
export class ScaleComponent {

  weight$: Observable<number>;
  zeroed$: Observable<boolean>;
  scaleSamples$: Observable<WeightSample[]>;
  changing$;
  count$;
  totalCount$;
  weightStdDev$;
  weightVariance$;
  weightMean$;
  weightCoefficientOfVariation$;
  lowerThreshold$;
  upperThreshold$;

  constructor(private scaleService: ScaleService, private weightSamplingService: WeightSamplingService) {
    this.weight$ = scaleService.weightInPounds$;
    this.zeroed$ = scaleService.zeroed$;
    this.scaleSamples$ = weightSamplingService.samples$;
    this.changing$ = scaleService.changing$;
    this.count$ = weightSamplingService.count$;
    this.totalCount$ = weightSamplingService.totalCount$;

    this.weightStdDev$ = weightSamplingService.weightStdDev$;
    this.weightVariance$ = weightSamplingService.weightVariance$;
    this.weightMean$ = weightSamplingService.weightMean$;
    this.weightCoefficientOfVariation$ = weightSamplingService.weightCoefficientOfVariation$;

    this.upperThreshold$ = weightSamplingService.upperThreshold$;
    this.lowerThreshold$ = weightSamplingService.lowerThreshold$;

    scaleService.zeroedEvent$.subscribe(() => console.log("zeroed event"))
  }

  open(): void {
    this.scaleService.open().subscribe(() => console.log('connected'));
  }

  close(): void {
    this.scaleService.close().subscribe(() => console.log("closed"));
  }

  increment() {
    this.weightSamplingService.increment();
  }
}
