import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HID_SCALE_CONFIG, HidScaleService } from './scale/hid-scale.service';
import { HARDWARE_SCALE } from './scale/hardware-scale-interface';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
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
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
