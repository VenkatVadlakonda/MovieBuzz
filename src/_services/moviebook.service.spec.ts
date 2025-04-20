import { TestBed } from '@angular/core/testing';

import { MoviebookService } from './moviebook.service';

describe('MoviebookService', () => {
  let service: MoviebookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviebookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
