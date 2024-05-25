import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilKeyChanged,
  filter,
  from,
  fromEvent,
  map,
  mergeMap,
  Observable,
  of,
  Subscription,
  tap,
  throwError
} from 'rxjs';
import { HardwareScaleInterface, HardwareScaleReportEvent } from './hardware-scale.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { DATA_MAPPERS } from './hid-scale.constants';


export type HidDataMapper = (arrayBuffer: ArrayBuffer) => HardwareScaleReportEvent;

@Injectable({
  providedIn: 'root'
})
export class HidScaleService implements HardwareScaleInterface {

  private s: BehaviorSubject<HardwareScaleReportEvent | undefined> = new BehaviorSubject<HardwareScaleReportEvent | undefined>(undefined)
  private hidDevice!: HIDDevice;
  private sub!: Subscription;

  reportEvent = () => this.s.asObservable();

  open(): Observable<void> {
    if (!('hid' in navigator)) {
      return throwError(() => new Error('Web HID not found'));
    }
    return from(navigator.hid.requestDevice({filters: [{usage:32, usagePage: 141}]}))
      .pipe(
        filter(devices => devices.length > 0),
        map(devices => devices[0])
      ).pipe(
        mergeMap(d => fromPromise(d.open())
          .pipe(tap(() => this.start(d)))
      )
    );
  }

  private start(d: HIDDevice): void {
    this.hidDevice = d;
    const dataMapper = DATA_MAPPERS[`${d.vendorId}-${d.productId}`]
    if (!dataMapper) {
      throw new Error(`No data mapper found for: ${d.productName}`);
    }
    this.sub = fromEvent<HIDInputReportEvent>(d, 'inputreport')
      .pipe(
        map(e => dataMapper(e.data.buffer)),
        distinctUntilKeyChanged('weight')
      ).subscribe(
        e => this.s.next(e)
      );
  }

  close(): Observable<void> {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    return this.hidDevice ? from(this.hidDevice.close()) : of();
  }

}
