import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaDonasPage } from './lista-donas.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Donas } from 'src/app/services/donas';
import { NavController } from '@ionic/angular';  // Asegúrate de importar NavController

describe('ListaDonasPage', () => {
  let component: ListaDonasPage;
  let fixture: ComponentFixture<ListaDonasPage>;
  let servicebdServiceSpy: jasmine.SpyObj<ServicebdService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let navControllerSpy: jasmine.SpyObj<NavController>; // Espía para NavController

  // En el beforeEach, simulamos que dbState devuelve un observable con valor true y fetchDonas un valor mock
  beforeEach(async () => {
    servicebdServiceSpy = jasmine.createSpyObj('ServicebdService', ['dbState', 'fetchDonas', 'eliminarDona', 'borrarDona', 'marcarNoDisponible', 'marcarComoDisponible']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

    // Simulamos el valor que dbState debe retornar, en este caso true para indicar que la DB está lista
    servicebdServiceSpy.dbState.and.returnValue(of(true));

    // Simulamos un arreglo de donas que fetchDonas debería retornar
    const mockDonas: Donas[] = [
      { iddona: 1, imagen: 'imagen1', nombre: 'Dona Chocolate', precio: 1.5, descripcion: 'Deliciosa dona de chocolate', stock: 100, disponible: 1 },
      { iddona: 2, imagen: 'imagen2', nombre: 'Dona Vainilla', precio: 1.0, descripcion: 'Dona de vainilla', stock: 120, disponible: 1 }
    ];
    servicebdServiceSpy.fetchDonas.and.returnValue(of(mockDonas));

    await TestBed.configureTestingModule({
      declarations: [ListaDonasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServicebdService, useValue: servicebdServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: navControllerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDonasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to agregar-dona page when agregar is called', () => {
    component.agregar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/agregar-dona']);
  });

  it('should navigate to editar-dona page with navigation extras when modificar is called', () => {
    const dona: Donas = { iddona: 1, imagen: 'imagen1', nombre: 'Dona Chocolate', precio: 1.5, descripcion: 'Dona de chocolate', stock: 100, disponible: 1 };
    const navigationExtras = {
      state: { dona: dona }
    };

    component.modificar(dona);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/editar-dona'], navigationExtras);
  });

  it('should remove dona from listaDonas when eliminar is called', async () => {
    const dona: Donas = { iddona: 1, imagen: 'imagen1', nombre: 'Dona Chocolate', precio: 1.5, descripcion: 'Dona de chocolate', stock: 100, disponible: 1 };
    component.listaDonas = [dona];
    servicebdServiceSpy.borrarDona.and.returnValue(Promise.resolve()); // Esto debe devolver una promesa

    await component.borrar(dona);
    fixture.detectChanges(); // Asegúrate de que el componente se actualice después de la promesa

    expect(servicebdServiceSpy.borrarDona).toHaveBeenCalledWith(dona.iddona);
    expect(component.listaDonas).toEqual([]); // O la lista de donas después de la eliminación
  });

  
  

  it('should update dona availability when marcarComoDisponible is called', async () => {
    const dona: Donas = { iddona: 1, imagen: 'imagen1', nombre: 'Dona Chocolate', precio: 1.5, descripcion: 'Dona de chocolate', stock: 100, disponible: 1 };
    servicebdServiceSpy.marcarComoDisponible.and.returnValue(Promise.resolve()); // Mock the promise return value

    await component.marcarComoDisponible(dona);
    fixture.detectChanges();

    expect(servicebdServiceSpy.marcarComoDisponible).toHaveBeenCalledWith(dona.iddona, 2); // Assuming the state changes to 2 (not available)
    expect(dona.disponible).toBe(2); // Verify that the available state changes
  });
});
