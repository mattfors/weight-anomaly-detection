import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, from, fromEvent, map, Observable, of, Subscription, switchMap, tap, throwError } from 'rxjs';
import { HardwareScaleInterface } from './hardware-scale-interface';


export interface HidScaleConfig {
  vendorId: number,
  byteOffset: number,
  littleEndian: boolean,
  decimal: number,
  conversionMultiplier: number,
  precision: number
}

export const HID_SCALE_CONFIG = new InjectionToken<HidScaleConfig>('HidScaleConfig');

@Injectable()
export class HidScaleService implements HardwareScaleInterface{

  private hidDevice!: HIDDevice;
  private subscription!: Subscription;
  private data: BehaviorSubject<DataView | null> = new BehaviorSubject<DataView | null>(null);
  readonly weightInPounds: Observable<number>;
  readonly precision: number;

  constructor(@Inject(HID_SCALE_CONFIG) public config: HidScaleConfig) {
    this.weightInPounds = this.data.pipe(map(dv => this.getWeightFromDataView(dv)));
    this.precision = config.precision;
  }


  private getWeightFromDataView(dv: DataView | null): number {
    if (dv) {
      return (dv.getInt16(this.config.byteOffset, this.config.littleEndian) / this.config.decimal) * this.config.conversionMultiplier;
    }
    return 0.0;
  }

  open(): Observable<void> {
    return this.requestDevice(this.config.vendorId).pipe(
      tap((d: HIDDevice) => this.hidDevice = d),
      switchMap(d => d.open()),
      tap(() => this.start())
    );
  }

  private requestDevice(vendorId: number): Observable<HIDDevice> {
    if (!('hid' in navigator)) {
      return throwError(() => new Error('Web HID not found'));
    }
    return from(navigator.hid.requestDevice({ filters: [{ vendorId }] })).pipe(
      map(d => {
        if (d.length === 0) {
          throw new Error('Scale not found');
        }
        return d[0];
      }));
  }

  private start() {
    if (!this.hidDevice) return;
    this.subscription = fromEvent<HIDInputReportEvent>(this.hidDevice, 'inputreport')
      .subscribe((event: HIDInputReportEvent) => this.data.next(event.data));
  }

  close(): Observable<void> {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.hidDevice) {
      return from(this.hidDevice.close());
    }
    return of();
  }
}
