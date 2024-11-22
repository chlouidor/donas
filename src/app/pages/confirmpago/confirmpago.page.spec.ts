import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmpagoPage } from './confirmpago.page';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs';

describe('ConfirmpagoPage', () => {
  let component: ConfirmpagoPage;
  let fixture: ComponentFixture<ConfirmpagoPage>;

  let mockRouter = {
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue({
      extras: { state: { carrito: [{ nombre: 'Dona', precio: 2, cantidad: 2 }], nombreCliente: 'Juan', fechaEmision: '22-11-2024' } }
    })
  };
  let mockActivatedRoute = {
    queryParams: of({})
  };
  let mockRegistrologinService = jasmine.createSpyObj('RegistrologinService', ['']);
  let mockServicebd = jasmine.createSpyObj('ServicebdService', ['insertarVenta']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmpagoPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: RegistrologinService, useValue: mockRegistrologinService },
        { provide: ServicebdService, useValue: mockServicebd }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmpagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total correctly', () => {
    component.carrito = [
      { nombre: 'Dona', precio: 2, cantidad: 2 },
      { nombre: 'Café', precio: 3, cantidad: 1 }
    ];
    component.calcularTotal();
    expect(component.total).toBe(7); 
  });

  it('should insert ventas correctly', async () => {
    const productoMock = { nombre: 'Dona', precio: 2, cantidad: 2 };
    component.carrito = [productoMock];
    component.nombreCliente = 'Juan';
    component.fechaEmision = '22-11-2024';

    mockServicebd.insertarVenta.and.returnValue(Promise.resolve());

    await component.insertarVenta();
    expect(mockServicebd.insertarVenta).toHaveBeenCalledWith(
      'Juan',
      '22-11-2024',
      'Dona',
      2,
      4 
    );
  });
});
