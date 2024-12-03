import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { of } from 'rxjs';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let registrologinServiceSpy: jasmine.SpyObj<RegistrologinService>;
  let carritoServiceSpy: jasmine.SpyObj<CarritoService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let nativeStorageSpy: jasmine.SpyObj<NativeStorage>;

  const mockUser = {
    id: 1,
    username: 'christ',
    email: 'ch.louidor@duocuc.cl',
    imagen: 'avatar.png',
    rol: 'admin', // Incluido para verificar si es administrador
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    registrologinServiceSpy = jasmine.createSpyObj('RegistrologinService', ['getCurrentUser', 'logOut']);
    carritoServiceSpy = jasmine.createSpyObj('CarritoService', ['vaciarCarrito']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    nativeStorageSpy = jasmine.createSpyObj('NativeStorage', ['remove']);

    registrologinServiceSpy.getCurrentUser.and.returnValue(mockUser);
    alertControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      onDidDismiss: () => Promise.resolve({}),
    } as any));

    await TestBed.configureTestingModule({
      declarations: [PerfilPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RegistrologinService, useValue: registrologinServiceSpy },
        { provide: CarritoService, useValue: carritoServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: NativeStorage, useValue: nativeStorageSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
});

it('debería establecer los datos del usuario si un usuario está conectado', () => {
    expect(component.username).toEqual(mockUser.username);
    expect(component.email).toEqual(mockUser.email);
    expect(component.imagenAvatar).toEqual(mockUser.imagen);
    expect(component.isLoggedIn).toBeTrue();
});

it('debería establecer isAdmin a true para un usuario autorizado', () => {
    expect(component.isAdmin).toBeTrue();
});

it('debería navegar a la página de configuraciones en goToSettings', () => {
    component.goToSettings();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/configuracion']);
});

it('debería navegar a la página mis-compras en goToCompras', () => {
    component.goToCompras();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mis-compras']);
});

it('debería navegar a la página lista-donas en goToDonas', () => {
    component.goToDonas();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lista-donas']);
});

it('debería navegar a la página historial en goToHistorial', () => {
    component.goToHistorial();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/historial']);
});

it('debería navegar a la página login en goToLogin', () => {
    component.goToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
});

it('debería cerrar sesión, vaciar el carrito, eliminar los datos del usuario y mostrar una alerta en logOut', async () => {
    await component.logOut();

    expect(nativeStorageSpy.remove).toHaveBeenCalledWith('ultimoUsuario');
    expect(carritoServiceSpy.vaciarCarrito).toHaveBeenCalled();
    expect(registrologinServiceSpy.logOut).toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inicio']);
});
});
