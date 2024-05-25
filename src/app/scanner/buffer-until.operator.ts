import { filter, map, MonoTypeOperatorFunction, Observable, scan } from 'rxjs';

const lastEquals = (a: string[], v: string): boolean => a.slice(-1)[0] === v;

export function bufferUntil(value: string): MonoTypeOperatorFunction<string> {
  return (source: Observable<string>): Observable<string> =>
    source.pipe(
      scan((a: string[], v: string) => lastEquals(a, value) ? [] : [...a, v], []),
      filter(a => lastEquals(a, value)),
      map(a => a.slice(0, -1).join(''))
    );
}
