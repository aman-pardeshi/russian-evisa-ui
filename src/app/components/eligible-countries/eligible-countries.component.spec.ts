import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleCountriesComponent } from './eligible-countries.component';

describe('EligibleCountriesComponent', () => {
  let component: EligibleCountriesComponent;
  let fixture: ComponentFixture<EligibleCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EligibleCountriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EligibleCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
