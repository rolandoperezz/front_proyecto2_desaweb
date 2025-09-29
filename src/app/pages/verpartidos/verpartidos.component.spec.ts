import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerpartidosComponent } from './verpartidos.component';

describe('VerpartidosComponent', () => {
  let component: VerpartidosComponent;
  let fixture: ComponentFixture<VerpartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerpartidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerpartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
