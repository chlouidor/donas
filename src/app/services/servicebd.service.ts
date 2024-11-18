import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Donas } from './donas';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {
  public basededatos!: SQLiteObject;

  tablaDona: string = "CREATE TABLE IF NOT EXISTS donas(iddona INTEGER PRIMARY KEY AUTOINCREMENT, imagen VARCHAR(250) NOT NULL, nombre VARCHAR(50) NOT NULL, precio REAL, descripcion TEXT NOT NULL, stock INTEGER DEFAULT 0, disponible INTEGER DEFAULT 1);";

registroDonas: string = 
    "INSERT OR IGNORE INTO donas(iddona, imagen, nombre, precio, descripcion, stock, disponible) VALUES " +
    "(1, 'assets/icon/clasica.png', 'Clásica', 2.00, 'Dona con sabor clásico y una pizca de azúcar flor', 100, 1)," +
    "(2, 'assets/icon/vainilla_acoiris.png', 'Vainilla Arcoiris', 5.00, 'Dona con cobertura sabor vainilla y grageas de colores', 50, 1)," +
    "(3, 'assets/icon/choco_arcoiris.png', 'Chocolate Arcoiris', 3.00, 'Dona con cobertura de chocolate y grageas de colores', 80, 1)," +
    "(4, 'assets/icon/glaseada.jpg', 'Glaseada', 2.00, 'Donas Glaseadas de textura suave y esponjosa', 120, 1)," +
    "(5, 'assets/icon/super8.png', 'Super8', 1.20, 'Dona con trozos de super8 bañada en vainilla', 60, 1)," +
    "(6, 'assets/icon/boston_manjar.png', 'Boston Manjar', 1.00, 'Dona con cobertura de chocolate, rellena de manjar blanco', 40, 1)," +
    "(7, 'assets/icon/rollo_canela.png', 'Rollo de Canela', 2.20, 'Masa enrollada y cortada en discos', 30, 1);";

    tablaRegistroVenta: string = 
    "CREATE TABLE IF NOT EXISTS registroventa(" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "nombre_cliente VARCHAR(50) NOT NULL, " +
    "fecha_emision DATE NOT NULL, " +
    "producto VARCHAR(50) NOT NULL, " +
    "cantidad INTEGER NOT NULL, " +  
    "precio REAL NOT NULL);";


    registroVentas: string = 
    "INSERT OR IGNORE INTO registroventa(nombre_cliente, fecha_emision, producto, precio, cantidad) VALUES " +
    "('Cliente1', '2024-10-16', 'Dona Clásica', 2.00, 1), " +
    "('Cliente2', '2024-10-16', 'Dona Vainilla Arcoiris', 5.00, 2);";

  listadoDonas = new BehaviorSubject<Donas[]>([]);
  listadoVentas = new BehaviorSubject<any[]>([]);
  carritoCompra: any[] = [];

  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController, private nativeStorage: NativeStorage) { 
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
    this.seleccionarVentas(); 
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
      await this.basededatos.executeSql('DROP TABLE IF EXISTS donas', []);

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
            descripcion: res.rows.item(i).descripcion,
            stock: res.rows.item(i).stock,       
            disponible: res.rows.item(i).disponible, 
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
            precio: res.rows.item(i).precio,
            cantidad: res.rows.item(i).cantidad
          });
        }
      }
      this.listadoVentas.next(items);
    });
  }
  

  insertarDona(imagen: string, nombre: string, precio: number, descripcion: string, stock: number, disponible: number) {
    return this.basededatos.executeSql(
      'INSERT INTO donas(imagen, nombre, precio, descripcion, stock, disponible) VALUES (?,?,?,?,?,?)', 
      [imagen, nombre, precio, descripcion, stock, disponible]
    ).then(res => {
      this.presentAlert("Insertar", "Dona Registrada");
      this.seleccionarDonas();
    }).catch(e => {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    });
  }
  

  marcarNoDisponible(id: number) {
    return this.basededatos.executeSql('UPDATE donas SET disponible = 2 WHERE iddona = ?', [id]).then(res => {
      this.seleccionarDonas();
    }).catch(e => {
      this.presentAlert('Marcar No Disponible', 'Error: ' + JSON.stringify(e));
    });
  }

  borrarDona(id: number) {
    return this.basededatos.executeSql('DELETE FROM donas WHERE iddona = ?', [id]).then(res => {
      this.seleccionarDonas(); 
    }).catch(e => {
      this.presentAlert('Eliminar Dona', 'Error: ' + JSON.stringify(e));
    });
  }
  
  
  marcarComoDisponible(idDona: number, nuevoEstado: number): Promise<void> {
    return this.basededatos.executeSql('UPDATE donas SET disponible = ? WHERE iddona = ?', [nuevoEstado, idDona])
      .then(() => {
        console.log(`Dona con ID ${idDona} marcada como ${nuevoEstado === 1 ? 'disponible' : 'no disponible'}`);
      })
      .catch(error => {
        console.error('Error al actualizar el estado de la dona:', error);
      });
  }
  

  modificarDona(id: number, imagen: string, nombre: string, precio: number, descripcion: string, stock: number) {
    return this.basededatos.executeSql('UPDATE donas SET imagen = ?, nombre = ?, precio = ?, descripcion = ?, stock = ? WHERE iddona = ?', [imagen, nombre, precio, descripcion, stock, id]).then(res => {
      this.presentAlert("Modificar", "Dona Modificada");
      this.seleccionarDonas();
    }).catch(e => {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    });
  }
  

  actualizarStock(id: number, cantidad: number) {
    return this.basededatos.executeSql('SELECT stock FROM donas WHERE iddona = ?', [id]).then(res => {
      if (res.rows.length > 0) {
        let stock = res.rows.item(0).stock - cantidad;
        let disponible = stock <= 0 ? 0 : 1;
        return this.basededatos.executeSql('UPDATE donas SET stock = ?, disponible = ? WHERE iddona = ?', [stock, disponible, id]).then(() => {
          this.seleccionarDonas();
          return Promise.resolve();  
        }).catch(e => {
          this.presentAlert('Actualizar Stock', 'Error al actualizar stock: ' + JSON.stringify(e));
          return Promise.reject(e); 
        });
      } else {
        this.presentAlert("Actualización de stock", "No se encontró el producto.");
        return Promise.resolve(); 
      }
    }).catch(e => {
      this.presentAlert('Actualizar Stock', 'Error al obtener el stock: ' + JSON.stringify(e));
      return Promise.reject(e);  
    });
}


  insertarVenta(nombre_cliente: string, fecha_emision: string, producto: string, cantidad: number, precio: number) {
    return this.basededatos.executeSql(
      'INSERT INTO registroventa(nombre_cliente, fecha_emision, producto, cantidad, precio) VALUES (?,?,?,?,?)', 
      [nombre_cliente, fecha_emision, producto, cantidad, precio]
    ).then(res => {
      console.log("Venta registrada con cantidad.");
    }).catch(e => {
      console.error("Error al registrar la venta:", e);
    });
  }
  

  agregarAlCarrito(producto: any, cantidad: number) {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const productoExistente = carrito.find((item: any) => item.iddona === producto.iddona);
  
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  vaciarCarrito() {
    this.carritoCompra = [];
    this.nativeStorage.remove('carritoCompra');
    console.log('Carrito vacío');
  }
  
}

