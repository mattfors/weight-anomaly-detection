import { Injectable } from '@angular/core';
import { fromEvent, map, Observable } from 'rxjs';
import { bufferUntil } from './buffer-until.operator';


@Injectable({
  providedIn: 'root'
})
export class KeyboardWedgeService {

  read(): Observable<string> {
    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      map(e => e.key),
      bufferUntil('Enter'));
  }
}
