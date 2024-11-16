import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaDonasPage } from './lista-donas.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Donas } from 'src/app/services/donas';

describe('ListaDonasPage', () => {
  let component: ListaDonasPage;
  let fixture: ComponentFixture<ListaDonasPage>;
  let servicebdServiceSpy: jasmine.SpyObj<ServicebdService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    servicebdServiceSpy = jasmine.createSpyObj('ServicebdService', ['dbState', 'fetchDonas', 'eliminarDona']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ListaDonasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServicebdService, useValue: servicebdServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDonasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should load listaDonas when db is ready', () => {
    const mockDonas: Donas[] = [
      { iddona: 1, imagen: 'imagen1', nombre: 'Dona Chocolate', precio: 1.5, descripcion: 'Deliciosa dona de chocolate' },
      { iddona: 2, imagen: 'imagen2', nombre: 'Dona Vainilla', precio: 1.0, descripcion: 'Dona de vainilla' }
    ];
    servicebdServiceSpy.dbState.and.returnValue(of(true));
    servicebdServiceSpy.fetchDonas.and.returnValue(of(mockDonas));

    component.ngOnInit();

    expect(component.listaDonas).toEqual(mockDonas);
    expect(servicebdServiceSpy.dbState).toHaveBeenCalled();
    expect(servicebdServiceSpy.fetchDonas).toHaveBeenCalled();
  });

  it('should navigate to agregar-dona page when agregar is called', () => {
    component.agregar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/agregar-dona']);
  });

  it('should navigate to editar-dona page with navigation extras when modificar is called', () => {
    const dona: Donas = { iddona: 1, imagen: 'imagen1', nombre: 'Dona Chocolate', precio: 1.5, descripcion: 'Dona de chocolate' };
    const navigationExtras = {
      state: { dona: dona }
    };

    component.modificar(dona);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/editar-dona'], navigationExtras);
  });

  it('should remove dona from listaDonas when eliminar is called', async () => {
    const dona: Donas = { iddona: 1, imagen: 'imagen1', nombre: 'Dona Chocolate', precio: 1.5, descripcion: 'Dona de chocolate' };
    component.listaDonas = [dona];
    servicebdServiceSpy.eliminarDona.and.returnValue(Promise.resolve());

    await component.eliminar(dona);

    expect(servicebdServiceSpy.eliminarDona).toHaveBeenCalledWith(dona.iddona);
    expect(component.listaDonas).toEqual([]);
  });

  it('should log an error if eliminar fails', async () => {
    const dona: Donas = { iddona: 1, imagen: 'imagen1', nombre: 'Dona Chocolate', precio: 1.5, descripcion: 'Dona de chocolate' };
    component.listaDonas = [dona];
    servicebdServiceSpy.eliminarDona.and.returnValue(Promise.reject('Error al eliminar'));

    spyOn(console, 'error');
    await component.eliminar(dona);

    expect(console.error).toHaveBeenCalledWith('Error al eliminar la dona:', 'Error al eliminar');
  });
});
