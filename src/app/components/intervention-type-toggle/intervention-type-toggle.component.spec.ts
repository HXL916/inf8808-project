import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionTypeToggleComponent } from './intervention-type-toggle.component';

describe('InterventionTypeToggleComponent', () => {
  let component: InterventionTypeToggleComponent;
  let fixture: ComponentFixture<InterventionTypeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterventionTypeToggleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionTypeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
