import { TestBed, inject } from '@angular/core/testing';

import { FriendApiService } from './friend-api.service';

describe('FriendApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendApiService]
    });
  });

  it('should be created', inject([FriendApiService], (service: FriendApiService) => {
    expect(service).toBeTruthy();
  }));
});
