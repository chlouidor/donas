import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguracionPage } from './configuracion.page';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs'; 
import { firstValueFrom } from 'rxjs';

describe('ConfiguracionPage', () => {
  let component: ConfiguracionPage;
  let fixture: ComponentFixture<ConfiguracionPage>;
  let registrologinServiceSpy: jasmine.SpyObj<RegistrologinService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Creación de los spies para los servicios
    registrologinServiceSpy = jasmine.createSpyObj('RegistrologinService', ['getCurrentUser', 'verificarUsuarioUnico', 'actualizarUsuario', 'cambiarContrasena']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configuración del módulo de pruebas
    TestBed.configureTestingModule({
      declarations: [ConfiguracionPage],
      providers: [
        { provide: RegistrologinService, useValue: registrologinServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(ConfiguracionPage);
    component = fixture.componentInstance;

    // Simular el comportamiento de `getCurrentUser`
    registrologinServiceSpy.getCurrentUser.and.returnValue({
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      rol: 'user',
      imagen: 'avatar.jpg'
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data', () => {
    expect(component.username).toBe('testuser');
    expect(component.email).toBe('testuser@example.com');
    expect(component.imagenAvatar).toBe('avatar.jpg');
  });



  it('should call actualizarDatos and show success alert', async () => {
    // Simular la respuesta de verificarUsuarioUnico
    registrologinServiceSpy.verificarUsuarioUnico.and.returnValue(firstValueFrom(of({ usernameEnUso: false, emailEnUso: false })));

    // Crear el objeto de la alerta simulada
    const alertMock = {
      present: jasmine.createSpy('present'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      animated: true,
      backdropDismiss: true
    } as unknown as HTMLIonAlertElement;
  
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertMock));
  
    // Llamar a actualizarDatos
    await component.actualizarDatos();
  
    // Verificar que se haya llamado a la alerta con el mensaje de éxito
    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Éxito',
      message: 'Tus datos han sido actualizados correctamente.',
      buttons: ['OK']
    });
    expect(alertMock.present).toHaveBeenCalled();
  });
  


  it('should handle error when updating user data', async () => {
    // Simular la respuesta del servicio de actualización como un error
    const errorResponse = { message: 'Error al actualizar los datos' };
    registrologinServiceSpy.actualizarUsuario.and.returnValue(Promise.reject(errorResponse));
  
    // Crear el objeto de la alerta simulada
    const alertMock = {
      present: jasmine.createSpy('present'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      animated: true,
      backdropDismiss: true
    } as unknown as HTMLIonAlertElement;
  
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertMock));
  
    // Llamar a actualizarDatos, que ahora debería manejar el error
    await component.actualizarDatos();
  
    // Verificar que se haya mostrado la alerta con el mensaje de error
    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'No se pudieron actualizar los datos. Inténtalo de nuevo.',
      buttons: ['OK']
    });
  
    expect(alertMock.present).toHaveBeenCalled();
  });
  
  

  it('should call chooseImageSource and select camera', async () => {
    const alertMock = {
      present: jasmine.createSpy('present'),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: { role: 'camera' } }))
    } as unknown as HTMLIonAlertElement;
  
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertMock));
  
    await component.chooseImageSource();
  
    // Verificar que la alerta se presenta
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });
  
});
