import { Injectable } from '@angular/core';
import { filter, fromEvent, map, Observable, scan } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardWedgeService {

  read(): Observable<string> {
    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      map(e => e.key),
      scan((acc: string[], v: string ) => acc.slice(-1)[0] === 'Enter' ? [] : [...acc, v], []),
      filter(acc => acc.slice(-1)[0] === 'Enter'),
      map(acc => acc.slice(0, -1).join(''))
    );
  }
}
