import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartlistComponent } from './apartlist.component';

describe('ApartlistComponent', () => {
  let component: ApartlistComponent;
  let fixture: ComponentFixture<ApartlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
