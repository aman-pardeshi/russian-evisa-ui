import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddionalDetailsComponent } from './addional-details.component';

describe('AddionalDetailsComponent', () => {
  let component: AddionalDetailsComponent;
  let fixture: ComponentFixture<AddionalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddionalDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
