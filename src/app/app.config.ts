import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HID_SCALE_CONFIG, HidScaleService } from './scale/hid-scale.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
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
    }, provideAnimationsAsync()
  ]

};
