import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HidScaleService } from './scale/hid-scale.service';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: 'HardwareScaleInterface',
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
