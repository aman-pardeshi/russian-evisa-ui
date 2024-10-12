import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalApplicationsComponent } from './total-applications.component';

describe('TotalApplicationsComponent', () => {
  let component: TotalApplicationsComponent;
  let fixture: ComponentFixture<TotalApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalApplicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
