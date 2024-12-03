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
      extras: { state: undefined }  // Simulamos que no hay estado en la navegación
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

  it('should assign default values when state is not passed', () => {
    // Llamamos a ngOnInit para simular el ciclo de vida del componente
    component.ngOnInit();

    // Verificamos que el carrito esté vacío
    expect(component.carrito.length).toBe(0);
    
    // Verificamos que el nombre del cliente sea el valor predeterminado
    expect(component.nombreCliente).toBe('Cliente Desconocido');
    
    // Verificamos que la fecha de emisión esté definida y en el formato correcto
    expect(component.fechaEmision).toMatch(/\d{2}-\d{2}-\d{4}/); // Asegura que la fecha esté en el formato dd-MM-yyyy
  });
});
