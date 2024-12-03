import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarDonaPage } from './editar-dona.page';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';
import { Camera,Photo } from '@capacitor/camera';
import { ServicebdService } from 'src/app/services/servicebd.service';

// Mocks de dependencias
class MockActivatedRoute {
  queryParams = of({}); // Simula el comportamiento de ActivatedRoute.queryParams
}

class MockRouter {
  getCurrentNavigation = () => ({ extras: { state: { dona: { iddona: 1, imagen: '', nombre: 'Dona', precio: 100, descripcion: 'Deliciosa dona', stock: 10 } } } });
  navigate = jasmine.createSpy('navigate');
}

class MockServicebdService {
  modificarDona = jasmine.createSpy('modificarDona').and.returnValue(Promise.resolve());
}

class MockAlertController {
  create = jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') }));
}

describe('EditarDonaPage', () => {
  let component: EditarDonaPage;
  let fixture: ComponentFixture<EditarDonaPage>;
  let router: MockRouter;
  let servicebd: MockServicebdService;
  let alertCtrl: MockAlertController;

  beforeEach(() => {
    router = new MockRouter();
    servicebd = new MockServicebdService();
    alertCtrl = new MockAlertController();

    TestBed.configureTestingModule({
      declarations: [EditarDonaPage],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useValue: router },
        { provide: ServicebdService, useValue: servicebd },
        { provide: AlertController, useValue: alertCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarDonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos de la dona desde el estado del router', () => {
    expect(component.dona.iddona).toBe(1);
    expect(component.dona.nombre).toBe('Dona');
    expect(component.dona.precio).toBe(100);
});

it('debería llamar a modificarDona y navegar al éxito', async () => {
    await component.modificar();
    expect(servicebd.modificarDona).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/lista-donas']);
});

it('debería mostrar una alerta si los campos están vacíos en validarYModificar', async () => {
    component.dona = { iddona: 1, imagen: '', nombre: '', precio: 0, descripcion: '', stock: 0, disponible: 1 };
    await component.validarYModificar();
    expect(alertCtrl.create).toHaveBeenCalledWith({
        header: 'Campos Vacíos',
        message: 'Todos los campos son obligatorios.',
        buttons: ['Aceptar']
    });
    const alert = await alertCtrl.create();
    expect(alert.present).toHaveBeenCalled();
});

  
  
});
