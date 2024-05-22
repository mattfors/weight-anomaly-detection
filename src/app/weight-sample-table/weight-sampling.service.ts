import { Injectable } from '@angular/core';
import { ScaleService } from '../scale/scale.service';
import { BehaviorSubject, map } from 'rxjs';
import { mean, quantile, stdDev, variance, } from '@mathigon/fermat'

export interface WeightSample {
  time: Date;
  weightInPounds: number;
  deltaPounds: number;
  count: number;
  deltaCount: number;
  meanWeight: number;
  anomalyDetected?: boolean;
  anomalyDescription?: string;
  zScore?: number;
}

export interface WeightStats {
  mean: number;
  standardDeviation: number
  variance: number | undefined
  coefficientOfVariation: number
  quantile1: number
  quantile3: number
  iqr: number
  lowerThreshold: number
  upperThreshold: number
}

@Injectable({
  providedIn: 'root'
})
export class WeightSamplingService {

  private count: BehaviorSubject<number> = new BehaviorSubject(0);
  private samples: BehaviorSubject<WeightSample[]> = new BehaviorSubject<WeightSample[]>([]);
  private sampleStats: BehaviorSubject<WeightStats|undefined> = new BehaviorSubject<WeightStats|undefined>(undefined);



  waitingForSample = false;
  previousSample: WeightSample | undefined;

  count$ = this.count.asObservable();
  samples$ = this.samples.asObservable();
  sampleStats$ = this.sampleStats.asObservable();
  totalCount$= this.samples$.pipe(map(s => s.reduce((a, b) => a+b.deltaCount, 0)));

  constructor(private scaleService: ScaleService) {
    scaleService.weightInPounds$.subscribe(v => {
      if (v > 0 && this.waitingForSample) {
        const s = this.calculateNextSample(v);
        const nextSamples = [... this.samples.getValue(), s];
        const nextStats = this.calculateStats(nextSamples);

        this.waitingForSample = false;
        this.previousSample = s;

        this.applyStatsToSamples(nextSamples, nextStats);

        this.samples.next(nextSamples)
        this.sampleStats.next(nextStats);
      }
    });

    scaleService.zeroedEvent$.subscribe(() => {
      this.count.next(0)
      this.previousSample = undefined;
    });

  }

  private calculateNextSample(weightInPounds: number): WeightSample {
    const deltaCount = this.round(this.count.getValue() - (this.previousSample?.count || 0));
    const deltaPounds = this.round(weightInPounds - (this.previousSample?.weightInPounds || 0));
    return {
      time: new Date(),
      weightInPounds,
      count: this.count.getValue(),
      deltaCount,
      deltaPounds,
      meanWeight: this.round(deltaPounds / deltaCount)
    };
  }

  private applyStatsToSamples(samples: WeightSample[], stats: WeightStats): void {
    samples.forEach(s => {
      if(s.meanWeight > stats.upperThreshold) {
        s.anomalyDetected = true;
        s.anomalyDescription = 'over';
      } else if (s.meanWeight < stats.lowerThreshold) {
        s.anomalyDetected = true;
        s.anomalyDescription = 'under';
      } else {
        s.anomalyDetected = false;
        s.anomalyDescription = undefined;
      }
      s.zScore = this.round((s.meanWeight - stats.mean) / stats.standardDeviation);
    });
  }

  private calculateStats(samples: WeightSample[]): WeightStats {
    const dataFrame: number[] = samples.map(s => s.meanWeight);
    const m: number = this.round(mean(dataFrame));
    const standardDeviation = this.round(stdDev(dataFrame));
    const v = this.roundUndefined(variance(dataFrame));
    const coefficientOfVariation = this.round(standardDeviation / m);
    const quantile1 = this.round(quantile(dataFrame, .25));
    const quantile3 = this.round(quantile(dataFrame, .75));
    const iqr = this.round(quantile3 - quantile1);
    const lowerThreshold = this.round(quantile1 - 1.5 * iqr);
    const upperThreshold = this.round(quantile3 + 1.5 * iqr);
    return {
      mean: m,
      standardDeviation,
      variance: v,
      coefficientOfVariation,
      quantile1,
      quantile3,
      iqr,
      lowerThreshold,
      upperThreshold
    };
  }

  roundUndefined(v: number|undefined): number|undefined {
    if (v) {
      return this.round(v);
    }
    return v;
  }

  round(v: number): number {
    return parseFloat(v.toFixed(this.scaleService.precision));
  }

  increment(count: number = 1): void {
    this.waitingForSample = true;
    this.count.next(this.count.getValue() + count);
  }

}
