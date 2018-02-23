import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralResultsComponent } from './general-results.component';

describe('GeneralResultsComponent', () => {
  let component: GeneralResultsComponent;
  let fixture: ComponentFixture<GeneralResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
