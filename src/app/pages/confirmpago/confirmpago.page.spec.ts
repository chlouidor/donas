import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmpagoPage } from './confirmpago.page';

describe('ConfirmpagoPage', () => {
  let component: ConfirmpagoPage;
  let fixture: ComponentFixture<ConfirmpagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmpagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
