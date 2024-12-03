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

  it('debería validar y mostrar una alerta cuando los campos están incompletos', async () => {
    component.nombre = '';
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

it('debería llamar a insertarDona y navegar cuando los campos están completos', async () => {
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

it('debería establecer disponibilidad en 1 cuando se selecciona "Sí" en la alerta', async () => {
    const mockAlert = {
      present: jasmine.createSpy('present'),
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            component.disponibilidad = 1;
          },
        },
        {
          text: 'No',
          handler: () => {
            component.disponibilidad = 0;
          },
        },
      ],
    };
  
    mockAlertController.create.and.returnValue(Promise.resolve(mockAlert));
  
    await component.showAvailabilityOptions();
  
    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Disponibilidad',
      message: '¿Está disponible el producto?',
      buttons: jasmine.any(Array),
    });
  
    mockAlert.buttons[0].handler();
  
    expect(component.disponibilidad).toBe(1);
  });

  
});
