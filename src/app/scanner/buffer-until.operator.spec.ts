import { of } from 'rxjs';
import { bufferUntil } from './buffer-until.operator';
import { TestScheduler } from 'rxjs/internal/testing/TestScheduler';


describe("BufferUntil", () => {

  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should buffer values until the specified value is encountered', () => {
    scheduler.run(({ expectObservable }) => {
      const source$ = of('a', 'b', 'c', 'd');
      const result$ = source$.pipe(bufferUntil('d'));
      expectObservable(result$).toBe('(a|)', {a: 'abc'});
    });

  });

});
