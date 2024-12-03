import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisComprasPage } from './mis-compras.page';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs';

describe('MisComprasPage', () => {
  let component: MisComprasPage;
  let fixture: ComponentFixture<MisComprasPage>;
  let registrologinServiceSpy: jasmine.SpyObj<RegistrologinService>;
  let servicebdSpy: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    registrologinServiceSpy = jasmine.createSpyObj('RegistrologinService', ['getCurrentUser']);
    servicebdSpy = jasmine.createSpyObj('ServicebdService', ['fetchVentas']);

    
    await TestBed.configureTestingModule({
      declarations: [MisComprasPage],
      providers: [
        { provide: RegistrologinService, useValue: registrologinServiceSpy },
        { provide: ServicebdService, useValue: servicebdSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MisComprasPage);
    component = fixture.componentInstance;

    
    registrologinServiceSpy.getCurrentUser.and.returnValue({
      id: 1,
      username: 'TestUser',
      email: 'testuser@example.com',
      rol: 'cliente',
    });

    servicebdSpy.fetchVentas.and.returnValue(of([])); 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar y filtrar compras basadas en el usuario actual', () => {
    const mockUser = {
      id: 1,
      username: 'TestUser',
      email: 'testuser@example.com',
      rol: 'cliente',
    };

    const mockVentas = [
      { nombre_cliente: 'TestUser', fecha_emision: '2024-11-01', producto: 'Dona 1', precio: 5 },
      { nombre_cliente: 'OtherUser', fecha_emision: '2024-11-03', producto: 'Dona 2', precio: 6 },
      { nombre_cliente: 'TestUser', fecha_emision: '2024-11-02', producto: 'Dona 3', precio: 4 },
    ];

    registrologinServiceSpy.getCurrentUser.and.returnValue(mockUser); 
    servicebdSpy.fetchVentas.and.returnValue(of(mockVentas)); 

    component.ngOnInit(); 
    fixture.detectChanges(); 

    // Verifica que las compras del usuario actual se filtren correctamente
    expect(component.compras.length).toBe(2); 
    expect(component.compras[0].producto).toBe('Dona 3'); // Compra más reciente del usuario
    expect(component.compras[1].producto).toBe('Dona 1'); // Segunda compra del usuario
  });

it('debería manejar el caso en el que el usuario actual no tiene compras', () => {
    const mockUser = {
      id: 1,
      username: 'TestUser',
      email: 'testuser@example.com',
      rol: 'cliente',
    };

    const mockVentas = [
      { nombre_cliente: 'OtherUser', fecha_emision: '2024-11-01', producto: 'Dona 1', precio: 5 },
    ];

    registrologinServiceSpy.getCurrentUser.and.returnValue(mockUser); 
    servicebdSpy.fetchVentas.and.returnValue(of(mockVentas)); 

    component.ngOnInit(); 
    fixture.detectChanges(); 

    // Verifica que si el usuario no tiene compras, el array `compras` se mantenga vacío
    expect(component.compras.length).toBe(0); 
  });

});
