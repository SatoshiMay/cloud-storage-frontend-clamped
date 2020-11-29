import { TestBed, inject } from '@angular/core/testing';

import { SecureInterceptor } from './secure-interceptor.service';

describe('SecureInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecureInterceptor]
    });
  });

  it('should be created', inject([SecureInterceptor], (service: SecureInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
