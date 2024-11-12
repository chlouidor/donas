import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AgregarDonaPage } from './agregar-dona.page';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('AgregarDonaPage', () => {
  let component: AgregarDonaPage;
  let fixture: ComponentFixture<AgregarDonaPage>;
  let servicebdServiceSpy: jasmine.SpyObj<ServicebdService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    servicebdServiceSpy = jasmine.createSpyObj('ServicebdService', ['insertarDona']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AgregarDonaPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ServicebdService, useValue: servicebdServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to lista-donas after successful insertion', async () => {
    component.imagen = 'someImageBase64';
    component.nombre = 'Dona Chocolate';
    component.precio = 2.50;  // Asegúrate de que este valor sea un número
    component.descripcion = 'Dona con cobertura de chocolate';
    
    servicebdServiceSpy.insertarDona.and.returnValue(Promise.resolve());

    await component.insertar();
    expect(servicebdServiceSpy.insertarDona).toHaveBeenCalledWith(
      'someImageBase64', 'Dona Chocolate', 2.50, 'Dona con cobertura de chocolate'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lista-donas']);
  });

  it('should log error when fields are empty', () => {
    spyOn(console, 'error');
    component.insertar();
    expect(console.error).toHaveBeenCalledWith('Todos los campos son obligatorios.');
  });
});
