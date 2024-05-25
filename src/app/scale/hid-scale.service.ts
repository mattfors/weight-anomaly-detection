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


type HidDataMapper = (arrayBuffer: ArrayBuffer) => HardwareScaleReportEvent;

const DATA_MAPPERS: {[key: string]: HidDataMapper}  = {
  '2338-32771' : (arrayBuffer: ArrayBuffer) => {
    const d = new Uint8Array(arrayBuffer);
    let weight = (d[3] + 256 * d[4])/10;
    if (d[0] === 5) {
      weight *= -1;
    }
    return {
      units: d[1] === 2 ? 'g' : 'oz',
      weight
    };
  }
}

const SCALE_DEVICES: HIDDeviceRequestOptions = {filters: [{usage:32, usagePage: 141}]};

@Injectable({
  providedIn: 'root'
})
export class HidScaleService implements HardwareScaleInterface {

  private s: BehaviorSubject<HardwareScaleReportEvent | undefined> = new BehaviorSubject<HardwareScaleReportEvent | undefined>(undefined)
  private hidDevice!: HIDDevice;
  private sub!: Subscription;
  private dataMapper!: HidDataMapper;

  reportEvent = () => this.s.asObservable();

  open(): Observable<void> {
    if (!('hid' in navigator)) {
      return throwError(() => new Error('Web HID not found'));
    }
    return from(navigator.hid.requestDevice(SCALE_DEVICES)).pipe(
      filter(devices => devices.length > 0),
      map(devices => devices[0])
    ).pipe(
      mergeMap(d => fromPromise(d.open()).pipe(
        tap(() => this.start(d)))
      )
    );
  }

  private start(d: HIDDevice): void {
    this.hidDevice = d;
    this.dataMapper = DATA_MAPPERS[`${d.vendorId}-${d.productId}`]
    if (!this.dataMapper) {
      throw new Error(`No data mapper found for: ${d.productName}`);
    }
    this.sub = fromEvent<HIDInputReportEvent>(d, 'inputreport').pipe(
      map(e => this.dataMapper(e.data.buffer)),
      distinctUntilKeyChanged('weight')
    ).subscribe(e => this.s.next(e));
  }

  close(): Observable<void> {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    return this.hidDevice ? from(this.hidDevice.close()) : of();
  }

}
