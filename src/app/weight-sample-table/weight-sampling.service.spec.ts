import { TestBed } from '@angular/core/testing';

import { WeightSamplingService } from './weight-sampling.service';

describe('WeightSamplingService', () => {
  let service: WeightSamplingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeightSamplingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
