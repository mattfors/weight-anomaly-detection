import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HID_SCALE_CONFIG, HidScaleService } from './scale/hid-scale.service';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: 'HardwareScaleInterface',
          useClass: HidScaleService
        },
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
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
