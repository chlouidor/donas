import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginPage } from './login.page';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';


// Mock de NativeStorage
class MockNativeStorage {
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve(value);
  }

  getItem(key: string): Promise<any> {
    return Promise.resolve(null);
  }

  remove(key: string): Promise<any> {
    return Promise.resolve();
  }
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertController: jasmine.SpyObj<AlertController>;
  let mockRegistrologinService: jasmine.SpyObj<RegistrologinService>;

  beforeEach(async () => {
    // Creación de mocks para los servicios y router
    mockRegistrologinService = jasmine.createSpyObj('RegistrologinService', ['loginUsuario']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AlertController, useValue: mockAlertController },
        { provide: RegistrologinService, useValue: mockRegistrologinService },
        { provide: NativeStorage, useClass: MockNativeStorage }  // Asegúrate de usar el mock de NativeStorage aquí
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar un error si el correo está vacío', async () => {
    component.email = '';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        header: 'Error',
        message: 'El campo de correo electrónico no puede estar vacío.'
    }));
});

it('debería mostrar un error si el formato del correo es inválido', async () => {
    component.email = 'invalidemail';
    component.password = 'Password1';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        header: 'Error',
        message: 'Por favor, introduce un correo electrónico válido.'
    }));
});

it('debería mostrar un error si la contraseña está vacía', async () => {
    component.email = 'test@example.com';
    component.password = '';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        header: 'Error',
        message: 'El campo de contraseña no puede estar vacío.'
    }));
});

it('debería mostrar un error si la contraseña tiene menos de 6 caracteres', async () => {
    component.email = 'test@example.com';
    component.password = 'Pass1';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        header: 'Error',
        message: 'La contraseña debe tener al menos 6 caracteres.'
    }));
});

it('debería mostrar un error si la contraseña no contiene un número', async () => {
    component.email = 'test@example.com';
    component.password = 'Password';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        header: 'Error',
        message: 'La contraseña debe contener al menos un número.'
    }));
});

it('debería mostrar un error si las credenciales son inválidas', async () => {
    component.email = 'test@example.com';
    component.password = 'Password1';
    mockRegistrologinService.loginUsuario.and.returnValue(Promise.resolve(false));

    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        header: 'Error',
        message: 'Credenciales incorrectas.'
    }));
});


});
