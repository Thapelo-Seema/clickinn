import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApartmentComponent } from './edit-apartment.component';

describe('EditApartmentComponent', () => {
  let component: EditApartmentComponent;
  let fixture: ComponentFixture<EditApartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditApartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
