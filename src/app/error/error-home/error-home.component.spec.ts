import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorHomeComponent } from './error-home.component';

describe('ErrorHomeComponent', () => {
  let component: ErrorHomeComponent;
  let fixture: ComponentFixture<ErrorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
