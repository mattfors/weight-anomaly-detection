import { Observable } from 'rxjs';

export interface HardwareScaleReportEvent {
  weight: number;
  units?: string;
}

export interface HardwareScaleInterface {
  open(): Observable<void>;
  close(): Observable<void>;
  reportEvent(): Observable<HardwareScaleReportEvent | undefined>;
}
