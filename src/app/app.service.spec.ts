import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';
import { HidScaleService } from './scale/hid-scale.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: 'HardwareScaleInterface',
          useClass: HidScaleService
        }
      ]
    });
    service = TestBed.inject(AppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
