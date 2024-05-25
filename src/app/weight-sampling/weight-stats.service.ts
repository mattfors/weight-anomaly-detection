import { Injectable } from '@angular/core';
import { WeightSample, WeightStats } from './weight-sample.model';
import { mean, quantile, stdDev, variance } from '@mathigon/fermat';

@Injectable({
  providedIn: 'root'
})
export class WeightStatsService {

  stats(samples: WeightSample[]): WeightStats {
    return this.statsFromDataFrame(this.dataFrame(samples));
  }

  statsFromDataFrame(dataFrame: number[]): WeightStats {
    const m: number = this.round(mean(dataFrame));
    const standardDeviation = this.round(stdDev(dataFrame));
    const v = this.round(variance(dataFrame));
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

  dataFrame(samples: WeightSample[]): number[] {
    return samples.map(s => s.meanWeight);
  }

  zScore(s: WeightSample, stats: WeightStats): number {
    return this.round((s.meanWeight - stats.mean) / stats.standardDeviation);
  }

  round(v: number | undefined): number {
    if (v) {
      return parseFloat(v.toFixed(2));
    }
    return 0;
  }

}
