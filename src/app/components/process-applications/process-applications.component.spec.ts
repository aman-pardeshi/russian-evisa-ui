import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessApplicationsComponent } from './process-applications.component';

describe('ProcessApplicationsComponent', () => {
  let component: ProcessApplicationsComponent;
  let fixture: ComponentFixture<ProcessApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessApplicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcessApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
