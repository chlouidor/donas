import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPage } from './recuperar.page';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RecuperarPage', () => {
  let component: RecuperarPage;
  let fixture: ComponentFixture<RecuperarPage>;
  let registrologinServiceSpy: jasmine.SpyObj<RegistrologinService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spy objects for the services
    registrologinServiceSpy = jasmine.createSpyObj('RegistrologinService', ['obtenerPreguntasPorEmail', 'recuperarContrasena', 'cambiarContrasenaPorEmail']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Setup TestBed
    TestBed.configureTestingModule({
      declarations: [RecuperarPage],
      providers: [
        { provide: RegistrologinService, useValue: registrologinServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a showAlert cuando el correo electrónico es inválido', async () => {
    const alertMock = { present: jasmine.createSpy('present') };
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertMock as any));

    // Simular la verificación fallida del correo electrónico
    registrologinServiceSpy.obtenerPreguntasPorEmail.and.returnValue(Promise.resolve(null));

    await component.verificarEmail();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Usuario no puede recuperar clave',
      buttons: ['OK']
    });
    expect(alertMock.present).toHaveBeenCalled();
});
it('debería cambiar la contraseña exitosamente', async () => {
  const alertMock = { present: jasmine.createSpy('present') };
  alertControllerSpy.create.and.returnValue(Promise.resolve(alertMock as any));

  // Simular el cambio exitoso de la contraseña
  registrologinServiceSpy.cambiarContrasenaPorEmail.and.returnValue(Promise.resolve());

  component.email = 'test@example.com';
  component.nuevaContrasena = 'newpassword123';
  component.confirmarContrasena = 'newpassword123';

  await component.cambiarContrasena();

  expect(registrologinServiceSpy.cambiarContrasenaPorEmail).toHaveBeenCalledWith('test@example.com', 'newpassword123');
  expect(alertControllerSpy.create).toHaveBeenCalledWith({
    header: 'Éxito',
    message: 'Contraseña cambiada con éxito.',
    buttons: ['OK']
  });
  expect(alertMock.present).toHaveBeenCalled();
  expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
});

});
