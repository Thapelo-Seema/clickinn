import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartUploadComponent } from './apart-upload.component';

describe('ApartUploadComponent', () => {
  let component: ApartUploadComponent;
  let fixture: ComponentFixture<ApartUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
