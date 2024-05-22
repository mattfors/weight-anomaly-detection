import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject, Subscription, tap } from 'rxjs';
import { HARDWARE_SCALE, HardwareScaleInterface } from './hardware-scale-interface';

@Injectable({
  providedIn: 'root'
})
export class ScaleService {

  readonly DUE_TIME = 500;

  private weightInPounds: BehaviorSubject<number> = new BehaviorSubject(0);
  private weightInPoundsSub!: Subscription;
  private zeroedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private zeroedEventSubject: Subject<void> = new Subject();
  private detectingChange: BehaviorSubject<boolean> = new BehaviorSubject(false);

  readonly weightInPounds$: Observable<number> = this.weightInPounds.asObservable();
  readonly changing$: Observable<boolean> = this.detectingChange.asObservable();
  readonly zeroed$: Observable<boolean> = this.zeroedSubject.asObservable();
  readonly zeroedEvent$: Observable<void> = this.zeroedEventSubject.asObservable();

  constructor(@Inject(HARDWARE_SCALE) private scale: HardwareScaleInterface) {}

  private handleValueChange(v: number): void {
    this.detectingChange.next(false);
    this.weightInPounds.next(v);
    if(v===0 && !this.zeroedSubject.value) {
      this.zeroedEventSubject.next();
      this.zeroedSubject.next(true);
    } else if (v>0 && this.zeroedSubject.value) {
      this.zeroedSubject.next(false);
    }
  }

  open(): Observable<void> {
    return this.scale.open().pipe(tap(() =>{
      this.weightInPoundsSub = this.scale.weightInPounds.pipe(
        distinctUntilChanged(),
        tap(v => this.detectingChange.next(true)),
        debounceTime(this.DUE_TIME))
        .subscribe(v => this.handleValueChange(v));
    }));
  }

  close(): Observable<void> {
    if (this.weightInPoundsSub) {
      this.weightInPoundsSub.unsubscribe();
    }
    return this.scale.close();
  }
}
