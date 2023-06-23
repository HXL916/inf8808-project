import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFlopComponent } from './top-flop.component';

describe('TopFlopComponent', () => {
  let component: TopFlopComponent;
  let fixture: ComponentFixture<TopFlopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopFlopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFlopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
