import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTopbarComponent } from './public-topbar.component';

describe('PublicTopbarComponent', () => {
  let component: PublicTopbarComponent;
  let fixture: ComponentFixture<PublicTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicTopbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
