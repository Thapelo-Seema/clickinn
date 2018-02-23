import { TestBed, inject } from '@angular/core/testing';

import { AccommService } from './accomm.service';

describe('AccommService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccommService]
    });
  });

  it('should be created', inject([AccommService], (service: AccommService) => {
    expect(service).toBeTruthy();
  }));
});
