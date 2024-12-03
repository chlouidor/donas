import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialPage } from './historial.page';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs';

describe('HistorialPage', () => {
  let component: HistorialPage;
  let fixture: ComponentFixture<HistorialPage>;
  let servicebdSpy: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    servicebdSpy = jasmine.createSpyObj('ServicebdService', ['fetchVentas']);
    servicebdSpy.fetchVentas.and.returnValue(of([])); // Devuelve un observable vacío

    await TestBed.configureTestingModule({
      declarations: [HistorialPage],
      providers: [
        { provide: ServicebdService, useValue: servicebdSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a cargarCompras al inicializar', () => {
    spyOn(component, 'cargarCompras');
    component.ngOnInit();
    expect(component.cargarCompras).toHaveBeenCalled();
});

it('debería obtener ventas y ordenarlas por fecha_emision', () => {
    const ventasSimuladas = [
        { fecha_emision: '2024-11-01T10:00:00Z' },
        { fecha_emision: '2024-11-02T15:00:00Z' },
        { fecha_emision: '2024-11-01T08:00:00Z' }
    ];
    servicebdSpy.fetchVentas.and.returnValue(of(ventasSimuladas));

    component.cargarCompras();
    expect(component.compras.length).toBe(3);
    expect(component.compras[0].fecha_emision).toBe('2024-11-02T15:00:00Z');
    expect(component.compras[2].fecha_emision).toBe('2024-11-01T08:00:00Z');
});

it('debería manejar una respuesta vacía de ventas', () => {
    servicebdSpy.fetchVentas.and.returnValue(of([]));
    component.cargarCompras();
    expect(component.compras.length).toBe(0);
});

});
