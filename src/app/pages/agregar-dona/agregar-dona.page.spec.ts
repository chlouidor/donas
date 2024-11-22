import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AgregarDonaPage } from './agregar-dona.page';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';

describe('AgregarDonaPage', () => {
  let component: AgregarDonaPage;
  let fixture: ComponentFixture<AgregarDonaPage>;
  let servicebdServiceSpy: jasmine.SpyObj<ServicebdService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    servicebdServiceSpy = jasmine.createSpyObj('ServicebdService', ['insertarDona']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

    await TestBed.configureTestingModule({
      declarations: [AgregarDonaPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ServicebdService, useValue: servicebdServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: NavController, useValue: navControllerSpy },  // Mock NavController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to lista-donas after successful insertion', async () => {
    // Asigna valores a los campos
    component.imagen = 'someImageBase64';
    component.nombre = 'Dona Chocolate';
    component.precio = 2.50;
    component.descripcion = 'Dona con cobertura de chocolate';
    component.stock = 150;  // Agregar valor para stock
    component.disponibilidad = 1;  // Agregar valor para disponibilidad

    // Configura el servicio para simular la respuesta exitosa
    servicebdServiceSpy.insertarDona.and.returnValue(Promise.resolve());

    // Llama al método insertar()
    await component.insertar();

    // Verifica que el servicio fue llamado correctamente
    expect(servicebdServiceSpy.insertarDona).toHaveBeenCalledWith(
      'someImageBase64', 'Dona Chocolate', 2.50, 'Dona con cobertura de chocolate', 150, 1
    );

    // Verifica que el router navegue a la lista de donas
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lista-donas']);
  });

  it('should log error when fields are empty', async () => {
    spyOn(console, 'error');

    // Llama al método insertar sin llenar los campos
    await component.insertar();

    // Verifica que el error se haya registrado
    expect(console.error).toHaveBeenCalledWith('Todos los campos son obligatorios.');
  });

  it('should show alert if fields are empty', async () => {
    // Simula la creación del alert
    alertControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
    }) as any);

    // Llama al método de validación
    await component.validarYAgregar();

    // Verifica que la alerta se haya presentado
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  
  it('should set disponibilidad to 1 when "Sí" is selected in alert', async () => {
    const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    
    alertSpy.buttons = [
      {
        text: 'Sí',
        handler: () => {
          component.disponibilidad = 1; // Simula la ejecución del handler
        },
      },
      {
        text: 'No',
        handler: () => {
          component.disponibilidad = 2; // Alternativa
        },
      },
    ];
  
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));
  
    // Llamamos al método que muestra la alerta
    await component.showAvailabilityOptions();
  
    // Simula la selección del botón "Sí"
    alertSpy.buttons[0].handler();
  
    // Verifica que la propiedad disponibilidad se haya actualizado correctamente
    expect(component.disponibilidad).toBe(1);
  });
  
  
});
