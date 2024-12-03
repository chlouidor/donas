import { ComponentFixture, TestBed } from '@angular/core/testing'; 
import { InicioPage } from './inicio.page';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { RegistrologinService } from 'src/app/services/registrologin.service'; 
import { ToastController } from '@ionic/angular'; 
import { of } from 'rxjs';

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let bdServiceSpy: jasmine.SpyObj<ServicebdService>;
  let registrologinServiceSpy: jasmine.SpyObj<RegistrologinService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    bdServiceSpy = jasmine.createSpyObj('ServicebdService', ['dbState', 'fetchDonas']);
    registrologinServiceSpy = jasmine.createSpyObj('RegistrologinService', ['getCurrentUser']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

    // Configurar el valor de los métodos simulados
    bdServiceSpy.dbState.and.returnValue(of(true)); // Simula que la base de datos está lista
    bdServiceSpy.fetchDonas.and.returnValue(of([{ 
      iddona: 1, 
      imagen: 'image.jpg', 
      nombre: 'Dona Clásica', 
      precio: 2.0, 
      descripcion: 'Una dona clásica', 
      stock: 10, 
      disponible: 1 
    }]));

    TestBed.configureTestingModule({
      declarations: [ InicioPage ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ServicebdService, useValue: bdServiceSpy },
        { provide: RegistrologinService, useValue: registrologinServiceSpy },
        { provide: ToastController, useValue: toastControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las donas al inicializar', () => {
    component.ngOnInit();
    expect(bdServiceSpy.fetchDonas).toHaveBeenCalled();
    expect(component.listaDona.length).toBeGreaterThan(0);
});

it('debería navegar a login si no hay un usuario conectado', async () => {
    registrologinServiceSpy.getCurrentUser.and.returnValue(null);
    const toastMock = { present: jasmine.createSpy('present') };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastMock as any));

    await component.irPagina(0);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastMock.present).toHaveBeenCalled();
});

it('debería mostrar un toast si el producto está fuera de stock', async () => {
    component.listaDona[0].stock = 0;
    const toastMock = { 
        present: jasmine.createSpy('present'),
        message: 'Este producto está fuera de stock.'
    };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastMock as any));

    await component.irPagina(0);
    expect(toastMock.present).toHaveBeenCalled();
    expect(toastMock.message).toContain('fuera de stock');
});

it('debería mostrar un toast si el producto no está disponible', async () => {
    component.listaDona[0].disponible = 0;
    const toastMock = { 
        present: jasmine.createSpy('present'),
        message: 'Este producto no está disponible.'
    };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastMock as any));

    await component.irPagina(0);
    expect(toastMock.present).toHaveBeenCalled();
    expect(toastMock.message).toContain('no está disponible');
});

});
