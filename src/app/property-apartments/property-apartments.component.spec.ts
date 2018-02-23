import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyApartmentsComponent } from './property-apartments.component';

describe('PropertyApartmentsComponent', () => {
  let component: PropertyApartmentsComponent;
  let fixture: ComponentFixture<PropertyApartmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyApartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyApartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
