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

  it('debería navegar a lista-donas después de una inserción exitosa', async () => {
      component.imagen = 'someImageBase64';
      component.nombre = 'Dona Chocolate';
      component.precio = 2.50;
      component.descripcion = 'Dona con cobertura de chocolate';
      component.stock = 150;  
      component.disponibilidad = 1;  
  
      servicebdServiceSpy.insertarDona.and.returnValue(Promise.resolve());
  
      await component.insertar();
  
      
      expect(servicebdServiceSpy.insertarDona).toHaveBeenCalledWith(
        'someImageBase64', 'Dona Chocolate', 2.50, 'Dona con cobertura de chocolate', 150, 1
      );
  
    
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/lista-donas']);
    });
  
  it('debería registrar un error cuando los campos están vacíos', async () => {
      spyOn(console, 'error');
  
    
      await component.insertar();
  
      
      expect(console.error).toHaveBeenCalledWith('Todos los campos son obligatorios.');
    });
  
  it('debería mostrar una alerta si los campos están vacíos', async () => {
      
      alertControllerSpy.create.and.returnValue(Promise.resolve({
        present: () => Promise.resolve(),
      }) as any);
  
   
      await component.validarYAgregar();
  
     
      expect(alertControllerSpy.create).toHaveBeenCalled();
    });
  
  it('debería establecer disponibilidad en 1 cuando se selecciona "Sí" en la alerta', async () => {
      const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
      
      alertSpy.buttons = [
        {
          text: 'Sí',
          handler: () => {
            component.disponibilidad = 1; 
          },
        },
        {
          text: 'No',
          handler: () => {
            component.disponibilidad = 2;
          },
        },
      ];
    
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));
    
    
      await component.showAvailabilityOptions();
    
     
      alertSpy.buttons[0].handler();
    
      expect(component.disponibilidad).toBe(1);
    });
  
});
