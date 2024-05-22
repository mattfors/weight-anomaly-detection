import { TestBed } from '@angular/core/testing';

import { ScaleService } from './scale.service';
import { HID_SCALE_CONFIG, HidScaleService } from './hid-scale.service';
import { HARDWARE_SCALE } from './hardware-scale-interface';

describe('ScaleService', () => {
  let service: ScaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
        },
        {
          provide: HARDWARE_SCALE,
          useClass: HidScaleService
        }
      ]
    });
    service = TestBed.inject(ScaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
