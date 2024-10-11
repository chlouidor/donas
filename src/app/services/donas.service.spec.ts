import { TestBed } from '@angular/core/testing';

import { DonasService } from './donas.service';

describe('DonasService', () => {
  let service: DonasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
