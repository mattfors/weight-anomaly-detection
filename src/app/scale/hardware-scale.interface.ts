import { Observable } from 'rxjs';


export interface HardwareScaleInterface {
  weightInPounds: Observable<number>;
  open(): Observable<void>;
  close(): Observable<void>;
  precision: number;
}
