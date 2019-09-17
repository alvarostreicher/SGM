import { TestBed } from '@angular/core/testing';

import { MaestrosService } from './maestros.service';

describe('MaestrosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaestrosService = TestBed.get(MaestrosService);
    expect(service).toBeTruthy();
  });
});
