import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MenuComponent } from './menu.component';
import { RegistrologinService } from 'src/app/services/registrologin.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let registrologinServiceSpy: jasmine.SpyObj<RegistrologinService>;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    registrologinServiceSpy = jasmine.createSpyObj('RegistrologinService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RegistrologinService, useValue: registrologinServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to inicio on goToInicio', () => {
    component.goToInicio();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inicio']);
  });

  it('should navigate to nosotros on goToNosotros', () => {
    component.goToNosotros();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/nosotros']);
  });

  it('should navigate to precios on goToPrecios', () => {
    component.goToPrecios();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/precios']);
  });

  it('should navigate to perfil on goToPerfil', () => {
    component.goToPerfil();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/perfil']);
  });

  it('should navigate to carrito on goToCarrito', () => {
    component.goToCarrito();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/carrito']);
  });
});
