import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPage } from './carrito.page';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { of } from 'rxjs';

describe('CarritoPage', () => {
  let component: CarritoPage;
  let fixture: ComponentFixture<CarritoPage>;

  let mockServicebd = jasmine.createSpyObj('ServicebdService', ['actualizarStock']);
  let mockRegistrologinService = jasmine.createSpyObj('RegistrologinService', ['getCurrentUser']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoPage],
      providers: [
        { provide: ServicebdService, useValue: mockServicebd },
        { provide: RegistrologinService, useValue: mockRegistrologinService },
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
