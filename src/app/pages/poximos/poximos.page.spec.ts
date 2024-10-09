import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoximosPage } from './poximos.page';

describe('PoximosPage', () => {
  let component: PoximosPage;
  let fixture: ComponentFixture<PoximosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PoximosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
