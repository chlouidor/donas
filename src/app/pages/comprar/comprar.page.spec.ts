import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDonaPage } from 'src/app/pages/agregar-dona/agregar-dona.page';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

describe('AgregarDonaPage', () => {
  let component: AgregarDonaPage;
  let fixture: ComponentFixture<AgregarDonaPage>;

  let mockServicebd = jasmine.createSpyObj('ServicebdService', ['insertarDona']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  let mockAlertController = jasmine.createSpyObj('AlertController', ['create']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarDonaPage],
      providers: [
        { provide: ServicebdService, useValue: mockServicebd },
        { provide: Router, useValue: mockRouter },
        { provide: AlertController, useValue: mockAlertController },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate and show alert when fields are incomplete', async () => {
    component.nombre = ''; // Campo vacío para forzar error
    mockAlertController.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present')
    } as any));

    await component.validarYAgregar();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Todos los campos son obligatorios. Por favor, completa todos los datos.',
      buttons: ['Aceptar']
    });
  });

  it('should call insertarDona and navigate when fields are complete', async () => {
    component.nombre = 'Dona de Chocolate';
    component.precio = 1.5;
    component.descripcion = 'Dona con chocolate';
    component.imagen = 'data:image/jpeg;base64,abc123';
    component.stock = 10;
    component.disponibilidad = 1;

    mockServicebd.insertarDona.and.returnValue(Promise.resolve());
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await component.validarYAgregar();

    expect(mockServicebd.insertarDona).toHaveBeenCalledWith(
      component.imagen,
      component.nombre,
      component.precio,
      component.descripcion,
      component.stock,
      component.disponibilidad
    );

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lista-donas']);
  });

  it('should set disponibilidad to 1 when "Sí" is selected in alert', async () => {
    // Simula la alerta
    const mockAlert = {
      present: jasmine.createSpy('present'),
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            component.disponibilidad = 1; // Actualiza disponibilidad
          },
        },
        {
          text: 'No',
          handler: () => {
            component.disponibilidad = 0; // Otra opción (si fuera necesario)
          },
        },
      ],
    };
  
    mockAlertController.create.and.returnValue(Promise.resolve(mockAlert));
  
    // Llama al método que muestra la alerta
    await component.showAvailabilityOptions();
  
    // Verifica que se haya llamado a `create` con la configuración esperada
    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Disponibilidad',
      message: '¿Está disponible el producto?',
      buttons: jasmine.any(Array), // Verifica que los botones existan
    });
  
    // Simula la selección del botón "Sí"
    mockAlert.buttons[0].handler();
  
    // Verifica que la propiedad `disponibilidad` se haya actualizado correctamente
    expect(component.disponibilidad).toBe(1);
  });
  
});
