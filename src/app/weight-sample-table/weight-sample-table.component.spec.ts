import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightSampleTableComponent } from './weight-sample-table.component';

describe('WeightSampleTableComponent', () => {
  let component: WeightSampleTableComponent;
  let fixture: ComponentFixture<WeightSampleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightSampleTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeightSampleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
