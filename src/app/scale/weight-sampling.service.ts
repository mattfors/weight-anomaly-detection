import { Injectable } from '@angular/core';
import { ScaleService } from './scale.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { mean, quantile, stdDev, variance,  } from '@mathigon/fermat'

export interface WeightSample {
  time: Date;
  weightInPounds: number;
  deltaPounds: number;
  count: number;
  deltaCount: number
  meanWeight: number
}

@Injectable({
  providedIn: 'root'
})
export class WeightSamplingService {

  private count: BehaviorSubject<number> = new BehaviorSubject(0);
  private samples: BehaviorSubject<WeightSample[]> = new BehaviorSubject<WeightSample[]>([]);

  waitingForSample = false;
  previousSample: WeightSample | undefined;

  count$ = this.count.asObservable();
  samples$ = this.samples.asObservable();
  totalCount$= this.samples$.pipe(map(s => s.reduce((a, b) => a+b.deltaCount, 0)));

  sampleWeightFrame$ = this.samples$.pipe(map(s => s.map(t => t.deltaPounds / t.deltaCount)));
  weightMean$ = this.sampleWeightFrame$.pipe(map(s => mean(s)));
  weightStdDev$= this.sampleWeightFrame$.pipe(map(s => stdDev(s)));
  weightVariance$ = this.sampleWeightFrame$.pipe(map(s => variance(s)));
  weightCoefficientOfVariation$ = combineLatest([this.weightStdDev$, this.weightMean$]).pipe(map(([std, m]: any) => std / m));

  weightQuantile1$ = this.sampleWeightFrame$.pipe(map(s => quantile(s, .25)));
  weightQuantile3$ = this.sampleWeightFrame$.pipe(map(s => quantile(s, .75)));
  weightIQR$ = combineLatest([this.weightQuantile3$, this.weightQuantile1$]).pipe(map(([q3, q1]: any) => q3-q1));
  lowerThreshold$ = combineLatest([this.weightQuantile1$, this.weightIQR$]).pipe(map(([q1, iqr]: any) => q1 - 1.5 * iqr));
  upperThreshold$ = combineLatest([this.weightQuantile3$, this.weightIQR$]).pipe(map(([q3, iqr]: any) => q3 + 1.5 * iqr));


  constructor(private scaleService: ScaleService) {
    scaleService.weightInPounds$.subscribe(v => {
      if (v > 0 && this.waitingForSample) {
        this.waitingForSample = false;
        const deltaCount = this.count.getValue() - (this.previousSample?.count || 0);
        const deltaPounds = v - (this.previousSample?.weightInPounds || 0);
        const s = {
          time: new Date(),
          weightInPounds: v,
          count: this.count.getValue(),
          deltaCount,
          deltaPounds,
          meanWeight: deltaPounds / deltaCount
        };
        this.previousSample = s;

        this.samples.next([... this.samples.getValue(), s])
      }
    });



    scaleService.zeroedEvent$.subscribe(() => {
      this.count.next(0)
      this.previousSample = undefined;
    });

  }

  increment(count: number = 1): void {
    this.waitingForSample = true;
    this.count.next(this.count.getValue() + count);
  }

}
