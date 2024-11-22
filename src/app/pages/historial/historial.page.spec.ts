import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialPage } from './historial.page';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs'; // Importa 'of' para crear observables simulados

describe('HistorialPage', () => {
  let component: HistorialPage;
  let fixture: ComponentFixture<HistorialPage>;
  let servicebdSpy: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    // Configura el espía del servicio con un método simulado
    servicebdSpy = jasmine.createSpyObj('ServicebdService', ['fetchVentas']);
    servicebdSpy.fetchVentas.and.returnValue(of([])); // Devuelve un observable vacío

    await TestBed.configureTestingModule({
      declarations: [HistorialPage],
      providers: [
        { provide: ServicebdService, useValue: servicebdSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
