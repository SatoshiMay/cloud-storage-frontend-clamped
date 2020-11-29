import { TestBed, inject } from '@angular/core/testing';

import { SearchApiService } from './search-api.service';

describe('SearchApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchApiService]
    });
  });

  it('should be created', inject([SearchApiService], (service: SearchApiService) => {
    expect(service).toBeTruthy();
  }));
});
