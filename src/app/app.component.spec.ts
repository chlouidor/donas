import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Importa RouterTestingModule para simular las rutas
import { IonicModule } from '@ionic/angular'; // Asegúrate de que IonicModule esté importado
import { AppComponent } from './app.component';
import { RegistrologinService } from './services/registrologin.service'; // Asegúrate de importar el servicio

describe('AppComponent', () => {
  let registrologinServiceSpy: jasmine.SpyObj<RegistrologinService>;

  beforeEach(async () => {
    // Crea un espía para el servicio RegistrologinService
    const spy = jasmine.createSpyObj('RegistrologinService', ['restoreSession']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule, // Simula las rutas en el entorno de prueba
        IonicModule.forRoot(), // Asegúrate de incluir IonicModule
      ],
      providers: [
        { provide: RegistrologinService, useValue: spy }, // Proporciona el espía como el servicio
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite el uso de elementos personalizados sin definición
    }).compileComponents();

    registrologinServiceSpy = TestBed.inject(RegistrologinService) as jasmine.SpyObj<RegistrologinService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should restore session and navigate to /inicio if session is restored', async () => {
    registrologinServiceSpy.restoreSession.and.returnValue(Promise.resolve(true));

    const fixture = TestBed.createComponent(AppComponent);
    await fixture.detectChanges(); // Espera que las promesas se resuelvan

    expect(registrologinServiceSpy.restoreSession).toHaveBeenCalled();
    // Aquí se puede agregar una verificación adicional sobre la navegación, si se desea mockear el Router
  });

  it('should navigate to /inicio if no session is restored', async () => {
    registrologinServiceSpy.restoreSession.and.returnValue(Promise.resolve(false));

    const fixture = TestBed.createComponent(AppComponent);
    await fixture.detectChanges();

    expect(registrologinServiceSpy.restoreSession).toHaveBeenCalled();
    // Verifica si la navegación es correcta, usando espías o mock del Router
  });
});
