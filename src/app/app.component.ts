import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatFormField } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeightSampleTableComponent } from './weight-sample-table/weight-sample-table.component';
import { Observable } from 'rxjs';
import { WeightSample, WeightSamplingService } from './weight-sample-table/weight-sampling.service';
import { ScaleService } from './scale/scale.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatChip,
    MatFormField,
    MatGridList,
    MatGridTile,
    MatInput,
    MatList,
    MatListItem,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    WeightSampleTableComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  weight$: Observable<number>;
  zeroed$: Observable<boolean>;
  scaleSamples$: Observable<WeightSample[]>;
  changing$;
  count$;
  totalCount$;
  sampleStats$;

  constructor(private scaleService: ScaleService, private weightSamplingService: WeightSamplingService) {
    this.weight$ = scaleService.weightInPounds$;
    this.zeroed$ = scaleService.zeroed$;
    this.scaleSamples$ = weightSamplingService.samples$;
    this.changing$ = scaleService.changing$;
    this.count$ = weightSamplingService.count$;
    this.totalCount$ = weightSamplingService.totalCount$;
    this.sampleStats$ = weightSamplingService.sampleStats$;
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

  protected readonly Object = Object;
  inputValue: any;

  triggerWeight(value: string) {
    this.scaleService.handleValueChange(parseFloat(value))
  }
}
