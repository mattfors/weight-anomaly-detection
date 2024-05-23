import { Injectable } from '@angular/core';
import { ScaleService } from '../scale/scale.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { WeightSample, WeightStats } from './weight-sample.model';
import { WeightStatsService } from './weight-stats.service';


@Injectable({
  providedIn: 'root'
})
export class WeightSamplingService {

  private count: BehaviorSubject<number> = new BehaviorSubject(0);
  private samples: BehaviorSubject<WeightSample[]> = new BehaviorSubject<WeightSample[]>([]);
  private sampleStats: BehaviorSubject<WeightStats|undefined> = new BehaviorSubject<WeightStats|undefined>(undefined);

  private lockedCount: boolean = false;

  waitingForSample = false;
  previousSample: WeightSample | undefined;

  count$ = this.count.asObservable();
  samples$ = this.samples.asObservable();
  sampleStats$ = this.sampleStats.asObservable();
  totalCount$= this.samples$.pipe(map(s => s.reduce((a, b) => a+b.deltaCount, 0)));

  theoreticalScaleCount$ = combineLatest([this.sampleStats$, this.scaleService.weightInPounds$]).pipe(
    map(([s, w]) => {
    if (s) {
      return Math.round(w / s.mean);
    }
    return 0;
  }));
  constructor(private scaleService: ScaleService, private weightStatsService: WeightStatsService) {
    scaleService.weightInPounds$.subscribe(v => {
      if (v > 0 && this.waitingForSample) {
        const s = this.calculateNextSample(v);
        const nextSamples = [... this.samples.getValue(), s];
        const nextStats = weightStatsService.stats(nextSamples, scaleService.precision);

        this.waitingForSample = false;
        this.previousSample = s;

        this.applyStatsToSamples(nextSamples, nextStats);

        this.samples.next(nextSamples)
        this.sampleStats.next(nextStats);
      }
    });

    scaleService.zeroedEvent$.subscribe(() => {
      if (this.lockedCount) {
        this.waitingForSample = true;
      } else {
        this.count.next(0);
      }
      this.previousSample = undefined;
    });

  }

  clearSamples(): void {
    this.samples.next([]);
    this.sampleStats.next(undefined);
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
      s.zScore = this.weightStatsService.zScore(s, stats, this.scaleService.precision)
    });
  }


  increment(count: number = 1): void {
    this.waitingForSample = true;
    this.count.next(this.count.getValue() + count);
  }


  lockCount(lockedCount: boolean): void {
    this.lockedCount = lockedCount;
  }

  private round(v: number): number {
    return this.weightStatsService.round(v, this.scaleService.precision);
  }

}
