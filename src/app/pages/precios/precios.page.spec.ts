import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreciosPage } from './precios.page';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PreciosPage', () => {
  let component: PreciosPage;
  let fixture: ComponentFixture<PreciosPage>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreciosPage],
      imports: [HttpClientTestingModule], // Importar el módulo de pruebas de HTTP
    }).compileComponents();

    fixture = TestBed.createComponent(PreciosPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); // Inyectar el HttpTestingController
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch a joke when getJoke is called', () => {
    const mockJoke = { value: 'Chuck Norris can divide by zero.' };

    component.selectedCategory = 'animal'; // Asignar una categoría seleccionada
    component.getJoke(); // Llamar al método que realiza la solicitud HTTP

    // Verificar que la solicitud HTTP se haya realizado
    const req = httpMock.expectOne(
      'https://api.chucknorris.io/jokes/random?category=animal'
    );
    expect(req.request.method).toBe('GET'); // Verificar que la solicitud fue un GET

    // Simular la respuesta de la API
    req.flush(mockJoke);

    // Verificar que el chiste fue asignado correctamente
    expect(component.joke).toBe(mockJoke.value);

    // Verificar que no haya solicitudes pendientes
    httpMock.verify();
  });

  it('should handle error when fetching joke fails', () => {
    component.selectedCategory = 'animal';
    component.getJoke(); // Llamar al método que realiza la solicitud HTTP

    // Verificar que la solicitud HTTP se haya realizado
    const req = httpMock.expectOne(
      'https://api.chucknorris.io/jokes/random?category=animal'
    );
    expect(req.request.method).toBe('GET');

    // Simular un error en la respuesta
    req.error(new ErrorEvent('Network error'));

    // Aquí puedes verificar el manejo de errores, por ejemplo, asegurarte de que el componente
    // maneja correctamente el error. En este caso, estamos imprimiendo el error en la consola.
    // Pero no afectará el flujo de la prueba.
    expect(component.joke).toBe('');
    httpMock.verify();
  });
});
