import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginPage } from './login.page';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { of } from 'rxjs';

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
        { provide: RegistrologinService, useValue: mockRegistrologinService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if email is empty', async () => {
    component.email = '';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'El campo de correo electrónico no puede estar vacío.'
    }));
  });

  it('should show error if email format is invalid', async () => {
    component.email = 'invalidemail';
    component.password = 'Password1';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'Por favor, introduce un correo electrónico válido.'
    }));
  });

  it('should show error if password is empty', async () => {
    component.email = 'test@example.com';
    component.password = '';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'El campo de contraseña no puede estar vacío.'
    }));
  });

  it('should show error if password length is less than 6 characters', async () => {
    component.email = 'test@example.com';
    component.password = 'Pass1';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'La contraseña debe tener al menos 6 caracteres.'
    }));
  });

  it('should show error if password does not contain a number', async () => {
    component.email = 'test@example.com';
    component.password = 'Password';
    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'La contraseña debe contener al menos un número.'
    }));
  });

  it('should show error alert on invalid credentials', async () => {
    component.email = 'test@example.com';
    component.password = 'Password1';
    
    mockRegistrologinService.loginUsuario.and.returnValue(Promise.resolve(false));

    await component.login();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'Credenciales incorrectas.'
    }));
  });

  it('should navigate to inicio on successful login', async () => {
    component.email = 'test@example.com';
    component.password = 'Password1';

    mockRegistrologinService.loginUsuario.and.returnValue(Promise.resolve(true));
    mockAlertController.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    }) as any);

    await component.login();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/inicio']);
  });
});
