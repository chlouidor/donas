import { TestBed } from '@angular/core/testing';

import { RegistrologinService } from './registrologin.service';

describe('RegistrologinService', () => {
  let service: RegistrologinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrologinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
