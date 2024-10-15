import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaDonasPage } from './lista-donas.page';

describe('ListaDonasPage', () => {
  let component: ListaDonasPage;
  let fixture: ComponentFixture<ListaDonasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDonasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
