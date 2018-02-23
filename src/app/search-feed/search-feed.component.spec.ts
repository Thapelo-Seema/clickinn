import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFeedComponent } from './search-feed.component';

describe('SearchFeedComponent', () => {
  let component: SearchFeedComponent;
  let fixture: ComponentFixture<SearchFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
