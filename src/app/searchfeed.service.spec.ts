import { TestBed, inject } from '@angular/core/testing';

import { SearchfeedService } from './searchfeed.service';

describe('SearchfeedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchfeedService]
    });
  });

  it('should be created', inject([SearchfeedService], (service: SearchfeedService) => {
    expect(service).toBeTruthy();
  }));
});
