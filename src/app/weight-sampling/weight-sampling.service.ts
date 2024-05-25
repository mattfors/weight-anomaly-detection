import { Injectable, signal, WritableSignal } from '@angular/core';
import { WeightSample, WeightStats } from './weight-sample.model';
import { WeightStatsService } from './weight-stats.service';


@Injectable({
  providedIn: 'root'
})
export class WeightSamplingService {

  private _samples: WritableSignal<WeightSample[]> = signal([])
  private _stats: WritableSignal<WeightStats | undefined> = signal(undefined)
  private previousSample: WeightSample | undefined;

  readonly samples = this._samples.asReadonly();
  readonly stats = this._stats.asReadonly();

  constructor(private weightStatsService: WeightStatsService) {
  }

  clearSamples(): void {
    this._samples.set([])
    this._stats.set(undefined);
  }

  addWeightReading(v: number, count: number, resetPrevious: boolean): void {
    if (resetPrevious) {
      this.previousSample = undefined;
    }
    if (v > 0) {
      const s = this.calculateNextSample(v, count);
      const nextSamples = [... this._samples(), s];
      const nextStats = this.weightStatsService.stats(nextSamples);
      this.previousSample = s;

      this.applyStatsToSamples(nextSamples, nextStats);

      this._samples.set(nextSamples)
      this._stats.set(nextStats);
    }
  }

  private calculateNextSample(weightInPounds: number, count: number): WeightSample {
    const deltaCount = this.round(count - (this.previousSample?.count || 0));
    const deltaPounds = this.round(weightInPounds - (this.previousSample?.weightInPounds || 0));
    return {
      time: new Date(),
      weightInPounds,
      count,
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
      s.zScore = this.weightStatsService.zScore(s, stats)
    });
  }

  private round(v: number): number {
    return this.weightStatsService.round(v);
  }

}
