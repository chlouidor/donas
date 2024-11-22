import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NosotrosPage } from './nosotros.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

describe('NosotrosPage', () => {
  let component: NosotrosPage;
  let fixture: ComponentFixture<NosotrosPage>;
  let inAppBrowserSpy: jasmine.SpyObj<InAppBrowser>;

  beforeEach(() => {
    inAppBrowserSpy = jasmine.createSpyObj('InAppBrowser', ['create']);

    TestBed.configureTestingModule({
      declarations: [NosotrosPage],
      providers: [
        { provide: InAppBrowser, useValue: inAppBrowserSpy } // Inyectar el espía
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Instagram when openInstagram is called', () => {
    component.openInstagram();
    // Verificar que se haya llamado al método create del InAppBrowser con la URL correcta
    expect(inAppBrowserSpy.create).toHaveBeenCalledWith('https://www.instagram.com/idkcloudd_/', '_system');
  });
});
