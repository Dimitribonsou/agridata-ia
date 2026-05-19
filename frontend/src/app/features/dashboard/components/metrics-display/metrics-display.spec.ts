import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsDisplay } from './metrics-display';

describe('MetricsDisplay', () => {
  let component: MetricsDisplay;
  let fixture: ComponentFixture<MetricsDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
