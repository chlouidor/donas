import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RegistroPage } from './registro.page';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { of } from 'rxjs';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertController: jasmine.SpyObj<AlertController>;
  let mockRegistrologinService: jasmine.SpyObj<RegistrologinService>;

  beforeEach(async () => {
    mockRegistrologinService = jasmine.createSpyObj('RegistrologinService', ['verificarUsuarioUnico', 'registrarUsuario']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);

    mockAlertController.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
        dismiss: jasmine.createSpy('dismiss'),
        onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve()),
        header: '',
        message: '',
        buttons: [],
      } as unknown as HTMLIonAlertElement)
    );
    

    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AlertController, useValue: mockAlertController },
        { provide: RegistrologinService, useValue: mockRegistrologinService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if username is empty', async () => {
    component.username = '';
    await component.registrar();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'El campo de nombre de usuario no puede estar vacío.',
    }));
  });

  it('should show error if email is invalid', async () => {
    component.username = 'testuser';
    component.email = 'invalidemail';
    await component.registrar();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'Por favor, introduce un correo electrónico válido.',
    }));
  });

  it('should show error if password and confirmPassword do not match', async () => {
    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'Password1';
    component.confirmPassword = 'Password2';
    await component.registrar();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'Las contraseñas no coinciden.',
    }));
  });

  it('should show error if username is already in use', async () => {
    component.username = 'Maxwell';
    component.email = 'test@example.com';
    component.password = 'Password1';
    component.confirmPassword = 'Password1';

    mockRegistrologinService.verificarUsuarioUnico.and.returnValue(Promise.resolve({ usernameEnUso: true, emailEnUso: false }));

    await component.registrar();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'El nombre de usuario ya está en uso.',
    }));
  });
});
