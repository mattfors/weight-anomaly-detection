import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';


export const HARDWARE_SCALE = new InjectionToken<HardwareScaleInterface>('HardwareScaleInterface');



export interface HardwareScaleInterface {
  weightInPounds: Observable<number>;
  open(): Observable<void>;
  close(): Observable<void>;
  precision: number;
}
