
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
