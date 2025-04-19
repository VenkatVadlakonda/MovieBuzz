import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviebookComponent } from './moviebook.component';

describe('MoviebookComponent', () => {
  let component: MoviebookComponent;
  let fixture: ComponentFixture<MoviebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviebookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
