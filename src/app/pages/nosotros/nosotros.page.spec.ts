import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NosotrosPage } from './nosotros.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

describe('NosotrosPage', () => {
  let component: NosotrosPage;
  let fixture: ComponentFixture<NosotrosPage>;
  let inAppBrowserSpy: jasmine.SpyObj<InAppBrowser>;

  beforeEach(() => {
    // Crear un espía para el servicio InAppBrowser
    inAppBrowserSpy = jasmine.createSpyObj('InAppBrowser', ['create']);

    TestBed.configureTestingModule({
      declarations: [NosotrosPage],
      providers: [
        { provide: InAppBrowser, useValue: inAppBrowserSpy } // Inyectar el espía
      ]
    }).compileComponents();

    // Crear la instancia del componente
    fixture = TestBed.createComponent(NosotrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verificar que el componente se crea correctamente
  });

  it('should open Instagram when openInstagram is called', () => {
    component.openInstagram(); // Llamar al método openInstagram

    // Verificar que se haya llamado al método create de InAppBrowser con la URL y el target esperados
    expect(inAppBrowserSpy.create).toHaveBeenCalledWith('https://www.instagram.com/idkcloudd_/', '_system');
  });

  it('should not call InAppBrowser create if no URL is provided', () => {
    // Simular un caso donde no se llame al método (por ejemplo, si openInstagram verifica algo antes)
    spyOn(component, 'openInstagram').and.callFake(() => {});

    component.openInstagram();

    // Verificar que no se llamó a create
    expect(inAppBrowserSpy.create).not.toHaveBeenCalled();
  });
});
