import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarDonaPage } from './editar-dona.page';

describe('EditarDonaPage', () => {
  let component: EditarDonaPage;
  let fixture: ComponentFixture<EditarDonaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarDonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
