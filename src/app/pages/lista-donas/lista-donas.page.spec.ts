import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaDonasPage } from './lista-donas.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Donas } from 'src/app/services/donas';
import { NavController } from '@ionic/angular';

describe('ListaDonasPage', () => {
  let component: ListaDonasPage;
  let fixture: ComponentFixture<ListaDonasPage>;
  let servicebdServiceSpy: jasmine.SpyObj<ServicebdService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    servicebdServiceSpy = jasmine.createSpyObj('ServicebdService', [
      'dbState',
      'fetchDonas',
      'eliminarDona',
      'borrarDona',
      'marcarNoDisponible',
      'marcarComoDisponible',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

    servicebdServiceSpy.dbState.and.returnValue(of(true));

    const mockDonas: Donas[] = [
      {
        iddona: 1,
        imagen: 'imagen1',
        nombre: 'Dona Chocolate',
        precio: 1.5,
        descripcion: 'Deliciosa dona de chocolate',
        stock: 100,
        disponible: 1,
      },
      {
        iddona: 2,
        imagen: 'imagen2',
        nombre: 'Dona Vainilla',
        precio: 1.0,
        descripcion: 'Dona de vainilla',
        stock: 120,
        disponible: 1,
      },
    ];
    servicebdServiceSpy.fetchDonas.and.returnValue(of(mockDonas));

    await TestBed.configureTestingModule({
      declarations: [ListaDonasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServicebdService, useValue: servicebdServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDonasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar a la página agregar-dona al llamar a agregar', () => {
    component.agregar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/agregar-dona']);
});

it('debería navegar a la página editar-dona con extras al llamar a modificar', () => {
    const dona: Donas = {
        iddona: 1,
        imagen: 'imagen1',
        nombre: 'Dona Chocolate',
        precio: 1.5,
        descripcion: 'Dona de chocolate',
        stock: 100,
        disponible: 1,
    };
    const navigationExtras = { state: { dona: dona } };

    component.modificar(dona);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/editar-dona'], navigationExtras);
});

it('debería eliminar una dona de listaDonas al llamar a borrar', async () => {
    const dona: Donas = {
        iddona: 1,
        imagen: 'imagen1',
        nombre: 'Dona Chocolate',
        precio: 1.5,
        descripcion: 'Dona de chocolate',
        stock: 100,
        disponible: 1,
    };
    component.listaDonas = [dona];
    servicebdServiceSpy.borrarDona.and.returnValue(Promise.resolve());

    await component.borrar(dona);
    fixture.detectChanges();

    expect(servicebdServiceSpy.borrarDona).toHaveBeenCalledWith(dona.iddona);
    expect(component.listaDonas).toEqual([]);
});

it('debería manejar errores al borrar de forma adecuada', async () => {
    const dona: Donas = {
        iddona: 1,
        imagen: 'imagen1',
        nombre: 'Dona Chocolate',
        precio: 1.5,
        descripcion: 'Dona de chocolate',
        stock: 100,
        disponible: 1,
    };
    component.listaDonas = [dona];
    servicebdServiceSpy.borrarDona.and.returnValue(Promise.reject('Error al eliminar'));

    await component.borrar(dona);
    fixture.detectChanges();

    expect(servicebdServiceSpy.borrarDona).toHaveBeenCalledWith(dona.iddona);
    expect(component.listaDonas).toContain(dona); // Verificar que no se elimine en caso de error
});

it('debería actualizar la disponibilidad de una dona al llamar a marcarComoDisponible', async () => {
    const dona: Donas = {
        iddona: 1,
        imagen: 'imagen1',
        nombre: 'Dona Chocolate',
        precio: 1.5,
        descripcion: 'Dona de chocolate',
        stock: 100,
        disponible: 1,
    };
    servicebdServiceSpy.marcarComoDisponible.and.returnValue(Promise.resolve());

    await component.marcarComoDisponible(dona);
    fixture.detectChanges();

    expect(servicebdServiceSpy.marcarComoDisponible).toHaveBeenCalledWith(dona.iddona, 2);
    expect(dona.disponible).toBe(2);
});

it('debería manejar errores al llamar a marcarComoDisponible de forma adecuada', async () => {
    const dona: Donas = {
        iddona: 1,
        imagen: 'imagen1',
        nombre: 'Dona Chocolate',
        precio: 1.5,
        descripcion: 'Dona de chocolate',
        stock: 100,
        disponible: 1,
    };
    servicebdServiceSpy.marcarComoDisponible.and.returnValue(Promise.reject('Error al actualizar'));

    await component.marcarComoDisponible(dona);
    fixture.detectChanges();

    expect(servicebdServiceSpy.marcarComoDisponible).toHaveBeenCalledWith(dona.iddona, 2);
    expect(dona.disponible).toBe(1); 
  });
});
