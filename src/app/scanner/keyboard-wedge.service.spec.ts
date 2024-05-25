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
});
