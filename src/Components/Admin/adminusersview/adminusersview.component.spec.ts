import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminusersviewComponent } from './adminusersview.component';

describe('AdminusersviewComponent', () => {
  let component: AdminusersviewComponent;
  let fixture: ComponentFixture<AdminusersviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminusersviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminusersviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
