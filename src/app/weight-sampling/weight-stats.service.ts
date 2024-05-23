import { Injectable } from '@angular/core';
import { WeightSample, WeightStats } from './weight-sample.model';
import { mean, quantile, stdDev, variance } from '@mathigon/fermat';

@Injectable({
  providedIn: 'root'
})
export class WeightStatsService {


  stats(samples: WeightSample[], precision: number): WeightStats {
    return this.statsFromDataFrame(this.dataFrame(samples), precision);
  }

  statsFromDataFrame(dataFrame: number[], precision: number): WeightStats {
    const m: number = this.round(mean(dataFrame), precision);
    const standardDeviation = this.round(stdDev(dataFrame), precision);
    const v = this.roundUndefined(variance(dataFrame), precision);
    const coefficientOfVariation = this.round(standardDeviation / m, precision);
    const quantile1 = this.round(quantile(dataFrame, .25), precision);
    const quantile3 = this.round(quantile(dataFrame, .75), precision);
    const iqr = this.round(quantile3 - quantile1, precision);
    const lowerThreshold = this.round(quantile1 - 1.5 * iqr, precision);
    const upperThreshold = this.round(quantile3 + 1.5 * iqr, precision);
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

  zScore(s: WeightSample, stats: WeightStats, precision: number): number {
    return this.round((s.meanWeight - stats.mean) / stats.standardDeviation, precision);
  }

  roundUndefined(v: number|undefined, precision: number): number|undefined {
    if (v) {
      return this.round(v, precision);
    }
    return v;
  }

  round(v: number, precision: number): number {
    return parseFloat(v.toFixed(precision));
  }

}
