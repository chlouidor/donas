import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDonaPage } from './agregar-dona.page';

describe('AgregarDonaPage', () => {
  let component: AgregarDonaPage;
  let fixture: ComponentFixture<AgregarDonaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
