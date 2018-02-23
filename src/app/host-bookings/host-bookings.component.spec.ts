import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostBookingsComponent } from './host-bookings.component';

describe('HostBookingsComponent', () => {
  let component: HostBookingsComponent;
  let fixture: ComponentFixture<HostBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
