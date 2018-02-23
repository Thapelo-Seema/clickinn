import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropUploadComponent } from './prop-upload.component';

describe('PropUploadComponent', () => {
  let component: PropUploadComponent;
  let fixture: ComponentFixture<PropUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
