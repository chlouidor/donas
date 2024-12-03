import { TestBed } from '@angular/core/testing';
import { RegistrologinService } from './registrologin.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ServicebdService } from './servicebd.service';

describe('RegistrologinService', () => {
  let service: RegistrologinService;
  let sqliteSpy: jasmine.SpyObj<SQLite>;
  let nativeStorageSpy: jasmine.SpyObj<NativeStorage>;
  let carritoServiceSpy: jasmine.SpyObj<ServicebdService>;

  beforeEach(() => {
    // Crear espías manualmente para SQLite
    sqliteSpy = jasmine.createSpyObj('SQLite', ['create', 'executeSql', 'deleteDatabase']);

    // Crear un objeto simulado de SQLiteObject
    const mockSQLiteObject: SQLiteObject = {
      executeSql: jasmine.createSpy().and.returnValue(Promise.resolve({ rows: { length: 0 } })),
      transaction: jasmine.createSpy(),
      readTransaction: jasmine.createSpy(),
      startNextTransaction: jasmine.createSpy(),
      open: jasmine.createSpy(),
      close: jasmine.createSpy(),
      sqlBatch: jasmine.createSpy(),
      abortallPendingTransactions: jasmine.createSpy(),
      _objectInstance: {} as any,
      databaseFeatures: {} as any,
      openDBs: [] as any,
      addTransaction: jasmine.createSpy(),
    };

    // Configurar el espía 'create' para que devuelva la promesa que resuelve el mockSQLiteObject
    sqliteSpy.create.and.returnValue(Promise.resolve(mockSQLiteObject));

    nativeStorageSpy = jasmine.createSpyObj<NativeStorage>('NativeStorage', ['setItem', 'remove', 'getItem']);
    carritoServiceSpy = jasmine.createSpyObj<ServicebdService>('ServicebdService', ['vaciarCarrito']);

    TestBed.configureTestingModule({
      providers: [
        RegistrologinService,
        { provide: SQLite, useValue: sqliteSpy },
        { provide: NativeStorage, useValue: nativeStorageSpy },
        { provide: ServicebdService, useValue: carritoServiceSpy }
      ]
    });

    service = TestBed.inject(RegistrologinService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });


  
  
  
});
