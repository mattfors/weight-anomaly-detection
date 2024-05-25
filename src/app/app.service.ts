import { Inject, Injectable, signal, Signal } from '@angular/core';
import { WeightSamplingService } from './weight-sampling/weight-sampling.service';
import { debounceTime, Observable, tap } from 'rxjs';
import { HardwareScaleInterface, HardwareScaleReportEvent } from './scale/hardware-scale.interface';
import { WeightSample, WeightStats } from './weight-sampling/weight-sample.model';

const DUE_TIME = 300;

export interface AppView {
  count: Signal<number>,
  weight: Signal<number>,
  zeroed: Signal<boolean>,
  reading: Signal<boolean>,
  units: Signal<string>,
  waitingForSample: Signal<boolean>,
  samples: Signal<WeightSample[]>,
  stats: Signal<WeightStats | undefined>
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly state = {
    count: signal(0),
    weight: signal(-1),
    zeroed: signal(true),
    reading: signal(false),
    units: signal(''),
    waitingForSample: signal(false),
  } as const;

  view: AppView = {
    count: this.state.count.asReadonly(),
    weight: this.state.weight.asReadonly(),
    zeroed: this.state.zeroed.asReadonly(),
    reading: this.state.reading.asReadonly(),
    units: this.state.units.asReadonly(),
    waitingForSample: this.state.waitingForSample.asReadonly(),
    samples: this.weightSamplingService.samples,
    stats: this.weightSamplingService.stats
  } as const;

  constructor(
    @Inject('HardwareScaleInterface') private scale: HardwareScaleInterface,
    private weightSamplingService: WeightSamplingService) {

  }

  startReading(): Observable<HardwareScaleReportEvent | undefined> {
    return this.scale.reportEvent().pipe(
      tap(() => this.state.reading.set(true)),
      debounceTime(DUE_TIME),
      tap(e => {
        this.state.reading.set(false)
        if (e) {
          this.addWeightReading(e.weight);
          this.state.weight.set(e.weight);
          this.state.units.set(e.units || '');
        }
      })
    )
  }

  increment() {
    this.state.waitingForSample.set(true);
    this.state.count.update(v => v + 1);
  }

  addWeightReading(v: number): void {
    if (v > 0 && this.state.waitingForSample()) {
      this.state.waitingForSample.set(false);
      this.weightSamplingService.addWeightReading(v, this.state.count(), this.state.zeroed())
    }
    if (v === 0) {
      this.state.zeroed.set(true);
      this.state.waitingForSample.set(false);
      this.state.count.set(0);
    } else {
      this.state.zeroed.set(false);
    }

  }
}
