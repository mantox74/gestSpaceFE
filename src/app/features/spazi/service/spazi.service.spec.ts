import { TestBed } from '@angular/core/testing';

import { SpaziService } from './spazi.service';

describe('SpaziService', () => {
  let service: SpaziService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaziService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
