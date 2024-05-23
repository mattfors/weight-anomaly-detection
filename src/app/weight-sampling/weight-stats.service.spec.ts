import { TestBed } from '@angular/core/testing';

import { WeightStatsService } from './weight-stats.service';

describe('WeightStatsService', () => {
  let service: WeightStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeightStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
