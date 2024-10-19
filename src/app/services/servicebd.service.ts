import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Donas } from './donas';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {
  public basededatos!: SQLiteObject;

  tablaDona: string = "CREATE TABLE IF NOT EXISTS donas(iddona INTEGER PRIMARY KEY AUTOINCREMENT, imagen VARCHAR(250) NOT NULL, nombre VARCHAR(50) NOT NULL, precio REAL, descripcion TEXT NOT NULL);";

  registroDonas: string = 
    "INSERT OR IGNORE INTO donas(iddona, imagen, nombre, precio, descripcion) VALUES " +
    "(1, 'assets/icon/clasica.png', 'Clásica', 2.00, 'Dona con sabor clásico y una pizca de azúcar flor')," +
    "(2, 'assets/icon/vainilla_acoiris.png', 'Vainilla Arcoiris', 5.00, 'Dona con cobertura sabor vainilla y grageas de colores')," +
    "(3, 'assets/icon/choco_arcoiris.png', 'Chocolate Arcoiris', 3.00, 'Dona con cobertura de chocolate y grageas de colores')," +
    "(4, 'assets/icon/glaseada.jpg', 'Glaseada', 2.00, 'Donas Glaseadas de textura suave y esponjosa')," +
    "(5, 'assets/icon/super8.png', 'Super8', 1.20, 'Dona con trozos de super8 bañada en vainilla')," +
    "(6, 'assets/icon/boston_manjar.png', 'Boston Manjar', 1.00, 'Dona con cobertura de chocolate, rellena de manjar blanco')," +
    "(7, 'assets/icon/rollo_canela.png', 'Rollo de Canela', 2.20, 'Masa enrollada y cortada en discos');";

  tablaRegistroVenta: string = 
    "CREATE TABLE IF NOT EXISTS registroventa(" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "nombre_cliente VARCHAR(50) NOT NULL, " +
    "fecha_emision DATE NOT NULL, " +
    "producto VARCHAR(50) NOT NULL, " +
    "precio REAL NOT NULL);";

  // Registro de Ventas inicial
  registroVentas: string = 
    "INSERT OR IGNORE INTO registroventa(nombre_cliente, fecha_emision, producto, precio) VALUES " +
    "('Cliente1', '2024-10-16', 'Dona Clásica', 2.00), " +
    "('Cliente2', '2024-10-16', 'Dona Vainilla Arcoiris', 5.00);";

  listadoDonas = new BehaviorSubject<Donas[]>([]);
  listadoVentas = new BehaviorSubject<any[]>([]);

  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) { 
    this.createBD();
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  fetchDonas(): Observable<Donas[]> {
    return this.listadoDonas.asObservable();
  }

  fetchVentas(): Observable<any[]> {
    return this.listadoVentas.asObservable();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  createBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'donas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.basededatos = db;
        this.crearTablas();
      }).catch(e => {
        this.presentAlert('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
      });
    });
  }

  async crearTablas() {
    try {
      await this.basededatos.executeSql(this.tablaDona, []);
      await this.basededatos.executeSql(this.registroDonas, []);
      await this.basededatos.executeSql(this.tablaRegistroVenta, []);
      await this.basededatos.executeSql(this.registroVentas, []);
      this.seleccionarDonas();
      this.seleccionarVentas();
      this.isDBReady.next(true);
    } catch (e) {
      this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }

  seleccionarDonas() {
    return this.basededatos.executeSql('SELECT * FROM donas', []).then(res => {
      let items: Donas[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            iddona: res.rows.item(i).iddona,
            imagen: res.rows.item(i).imagen,
            nombre: res.rows.item(i).nombre,
            precio: res.rows.item(i).precio,
            descripcion: res.rows.item(i).descripcion
          });
        }
      }
      this.listadoDonas.next(items);
    });
  }

  seleccionarVentas() {
    return this.basededatos.executeSql('SELECT * FROM registroventa', []).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            nombre_cliente: res.rows.item(i).nombre_cliente,
            fecha_emision: res.rows.item(i).fecha_emision,
            producto: res.rows.item(i).producto,
            precio: res.rows.item(i).precio
          });
        }
      }
      this.listadoVentas.next(items);
    });
  }

  insertarDona(imagen: string, nombre: string, precio: number, descripcion: string) {
    return this.basededatos.executeSql('INSERT INTO donas(imagen, nombre, precio, descripcion) VALUES (?,?,?,?)', [imagen, nombre, precio, descripcion]).then(res => {
      this.presentAlert("Insertar", "Dona Registrada");
      this.seleccionarDonas();
    }).catch(e => {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    });
  }

  eliminarDona(id: number) {
    return this.basededatos.executeSql('DELETE FROM donas WHERE iddona = ?', [id]).then(res => {
      this.presentAlert("Eliminar", "Dona Eliminada");
      this.seleccionarDonas();
    }).catch(e => {
      this.presentAlert('Eliminar dona', 'Error: ' + JSON.stringify(e));
    });
  }

  modificarDona(id: number, imagen: string, nombre: string, precio: number, descripcion: string) {
    return this.basededatos.executeSql('UPDATE donas SET imagen = ?, nombre = ?, precio = ?, descripcion = ? WHERE iddona = ?', [imagen, nombre, precio, descripcion, id]).then(res => {
      this.presentAlert("Modificar", "Dona Modificada");
      this.seleccionarDonas();
    }).catch(e => {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    });
  }

  insertarVenta(nombre_cliente: string, fecha_emision: string, producto: string, precio: number) {
    return this.basededatos.executeSql('INSERT INTO registroventa(nombre_cliente, fecha_emision, producto, precio) VALUES (?,?,?,?)', [nombre_cliente, fecha_emision, producto, precio]).then(res => {
      this.seleccionarVentas();
    }).catch(e => {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    });
  }
}
