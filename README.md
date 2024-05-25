# Weight Anomaly Detection

This project serves as a proof of concept for utilizing weight samples obtained from a USB scale to detect anomalies, such as deviations from expected part quantities.

To try the demo: [mattfors.github.io/weight-anomaly-detection/](https://mattfors.github.io/weight-anomaly-detection/)

![demo](/images/bobbins.gif)

## Barcodes from USB scanner

I created a convenience RxJS operator to collect strings until a specific value is emitted. 

```typescript
const lastEquals = (a: string[], v: string): boolean => a.slice(-1)[0] === v;

export function bufferUntil(value: string): MonoTypeOperatorFunction<string> {
  return (source: Observable<string>): Observable<string> =>
    source.pipe(
      scan((a: string[], v: string) => lastEquals(a, value) ? [] : [...a, v], []),
      filter(a => lastEquals(a, value)),
      map(a => a.slice(0, -1).join(''))
    );
}
```

The scanner's input is treated as keystrokes and my specific scanner is configured to append a carriage return. I buffer all keydowns until an Enter key before emitting the full string with the Enter removed.

```typescript
read(): Observable<string> {
  return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    map(e => e.key),
    bufferUntil('Enter'));
}
```

## Weight readings from USB HID scale
First I created a couple interfaces in order to wrap the HID device to use RxJS and because I'd like to use other non-HID scale types in the future such as serial.

```typescript
export interface HardwareScaleReportEvent {
  weight: number;
  units?: string;
}

export interface HardwareScaleInterface {
  open(): Observable<void>;
  close(): Observable<void>;
  reportEvent(): Observable<HardwareScaleReportEvent | undefined>;
}
```

I only have a DYMO M25 25 Lb Digital Postal Scale, so I've defined a mapper with a keys of the vendor and product IDs. This is to easily support adding additional scales in the future. It requires a function that take the ArrayBuffer emitted by the scale and turns it into a weight reporting event that has the weight and units set from the scale. 

```typescript
export const DATA_MAPPERS: {[key: string]: HidDataMapper}  = {
  /* DYMO M25 25 Lb Digital Postal Scale */
  '2338-32771' : (arrayBuffer: ArrayBuffer): HardwareScaleReportEvent => {
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
```

On open, available devices are filtered down to scale types and the HID device is opened. Promises have been converted to observables.

```typescript
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
```

Then reading input report events begins while converting data into the more usable weight interface. The scale continuously reports data even without change so `distinctUntilKeyChanged` is used in order to prevent emit spam when nothing is changing. Debounce is handled in a different service because it is common among all scale connection types. 

```typescript
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
```

Finally, the application can begin reading data from the scale. At this point that data is debounced as the scale always returns several reading before settling. Note that I've also added a flag which wraps the debounce operator. This is important to provide immediate feedback to users that something is happening when they place an item on the scale.

```typescript
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
```


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
