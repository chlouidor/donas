import { TestBed } from '@angular/core/testing';
import { ServicebdService } from './servicebd.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('ServicebdService', () => {
  let service: ServicebdService;
  let sqliteSpy: jasmine.SpyObj<SQLite>;
  let platformSpy: jasmine.SpyObj<Platform>;
  let nativeStorageSpy: jasmine.SpyObj<NativeStorage>;

  beforeEach(() => {
    // Crear espías manualmente para SQLite
    sqliteSpy = jasmine.createSpyObj('SQLite', ['create']);
    
    // Crear espías para las otras dependencias
    platformSpy = jasmine.createSpyObj('Platform', ['ready']);
    nativeStorageSpy = jasmine.createSpyObj('NativeStorage', ['remove']);

    // Simulamos que Platform.ready devuelve una promesa resuelta con un string
    platformSpy.ready.and.returnValue(Promise.resolve('ready'));

    // Simulamos un objeto SQLiteObject con las propiedades mínimas necesarias
    const fakeSQLiteObject: Partial<SQLiteObject> = {
      executeSql: jasmine.createSpy('executeSql')
    };
    // Aseguramos que sqliteSpy.create devuelve este objeto simulado
    sqliteSpy.create.and.returnValue(Promise.resolve(fakeSQLiteObject as SQLiteObject));

    TestBed.configureTestingModule({
      providers: [
        ServicebdService,
        { provide: SQLite, useValue: sqliteSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: NativeStorage, useValue: nativeStorageSpy }
      ]
    });

    // Obtener instancia del servicio
    service = TestBed.inject(ServicebdService);
  });

  it('should create', () => {
    // Verificar que el servicio se haya creado correctamente
    expect(service).toBeTruthy();
  });

  it('should call create method from SQLite and return a promise', async () => {
    // Llamamos al método createBD
    await service.createBD();

    // Verificamos que el método create fue llamado
    expect(sqliteSpy.create).toHaveBeenCalled();
  });
});
