import { TestBed } from '@angular/core/testing';

import { KeyboardWedgeService } from './keyboard-wedge.service';

describe('KeyboardWedgeService', () => {
  let service: KeyboardWedgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardWedgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the correct string when "Enter" key is pressed', (done: DoneFn) => {
    const mockDocument = {
      addEventListener: (event: string, handler: EventListener) => {
        if (event === 'keydown') {
          handler(new KeyboardEvent('keydown', { key: 'A' }));
          handler(new KeyboardEvent('keydown', { key: 'Enter' }));
        }
      }
    };


    service.read().subscribe((value) => {
      expect(value).toBe('A');
      done();
    });
  });
});
