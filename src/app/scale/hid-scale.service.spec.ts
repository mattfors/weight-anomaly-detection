import { TestBed } from '@angular/core/testing';

import { HID_SCALE_CONFIG, HidScaleService } from './hid-scale.service';

describe('HidScaleService', () => {
  let service: HidScaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HidScaleService,
        {
          provide: HID_SCALE_CONFIG,
          useValue: {
            vendorId: 2338,
            byteOffset: 3,
            littleEndian: true,
            decimal: 10,
            conversionMultiplier: 0.0625,
            precision: 4
          }
        }
      ]
    });
    service = TestBed.inject(HidScaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
