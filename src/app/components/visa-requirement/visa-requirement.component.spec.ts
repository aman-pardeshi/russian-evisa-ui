import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaRequirementComponent } from './visa-requirement.component';

describe('VisaRequirementComponent', () => {
  let component: VisaRequirementComponent;
  let fixture: ComponentFixture<VisaRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisaRequirementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisaRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
