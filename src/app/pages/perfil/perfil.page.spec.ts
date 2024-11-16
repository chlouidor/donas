import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { of } from 'rxjs';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let registrologinServiceSpy: jasmine.SpyObj<RegistrologinService>;
  let carritoServiceSpy: jasmine.SpyObj<CarritoService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  const mockUser = {
    id: 1, // Asegúrate de incluir este campo 'id' con un valor numérico
    username: 'christ',
    email: 'ch.louidor@duocuc.cl',
    imagen: 'avatar.png'
  };
  

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    registrologinServiceSpy = jasmine.createSpyObj('RegistrologinService', ['getCurrentUser', 'logOut']);
    carritoServiceSpy = jasmine.createSpyObj('CarritoService', ['vaciarCarrito']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set user data if a user is logged in', () => {
    expect(component.username).toEqual(mockUser.username);
    expect(component.email).toEqual(mockUser.email);
    expect(component.imagenAvatar).toEqual(mockUser.imagen);
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should set isAuthorizedUser to true for authorized user', () => {
    component.ngOnInit();
    expect(component.isAuthorizedUser).toBeTrue();
  });

  it('should navigate to configuracion page on goToSettings', () => {
    component.goToSettings();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/configuracion']);
  });

  it('should navigate to mis-compras page on goToCompras', () => {
    component.goToCompras();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mis-compras']);
  });

  it('should navigate to lista-donas page on goToDonas', () => {
    component.goToDonas();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lista-donas']);
  });

  it('should navigate to login page on goToLogin', () => {
    component.goToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should log out and clear carrito on logOut', async () => {
    await component.logOut();
    expect(carritoServiceSpy.vaciarCarrito).toHaveBeenCalled();
    expect(registrologinServiceSpy.logOut).toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inicio']);
  });
});
