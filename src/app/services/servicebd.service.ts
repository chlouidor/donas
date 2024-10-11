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

  tablaDona: string = "CREATE TABLE IF NOT EXISTS donas(iddona INTEGER PRIMARY KEY autoincrement, imagen VARCHAR(250) NOT NULL,nombre VARCHAR(50) NOT NULL,precio INTERGER, descripcion TEXT NOT NULL);";

  registroDonas: string = `
  INSERT or IGNORE INTO donas(iddona, imagen, nombre, precio, descripcion) 
  VALUES 
  (1, 'assets/icon/clasica.png', 'Clásica', '2.000', 'Dona con sabor clásico y una pizca de azúcar flor'),
  (2, 'assets/icon/vainilla_acoiris.png', 'Vainilla Arcoiris', '5.000', 'Dona con cobertura sabor vainilla y grageas de colores'),
  (3, 'assets/icon/choco_arcoiris.png', 'Chocolate Arcoiris', '3.000', 'Dona con cobertura de chocolate y grageas de colores'),
  (4, 'assets/icon/glaseada.jpg', 'Glaseada', '2.000', 'Donas Glaseadas de textura suave y esponjosa'),
  (5, 'assets/icon/super8.png', 'Super8', '1.200', 'Dona con trozos de super8 bañada en vainilla'),
  (6, 'assets/icon/boston_manjar.png', 'Boston Manjar', '1.000', 'Donut con cobertura de chocolate, rellena de manjar blanco'),
  (7, 'assets/icon/rollo_canela.png', 'Rollo de Canela','2.200', 'Masa enrollada y cortada en discos' )
`;

listadoDonas = new BehaviorSubject([]);

private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) { 
    this.createBD();
  }

  async presentAlert(titulo: string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  fetchDonas(): Observable<Donas[]>{
    return this.listadoDonas.asObservable();
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  createBD(){
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'donas.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        this.basededatos = db;
        this.crearTablas();
      }).catch(e=>{
        this.presentAlert('Base de Datos Donas', 'Error en crear la BD: ' + JSON.stringify(e));
      })
    })

  }

  async crearTablas(){
    try{
      await this.basededatos.executeSql(this.tablaDona, []);
      await this.basededatos.executeSql(this.registroDonas, []);
      this.seleccionarDonas();
      this.isDBReady.next(true);
    }catch(e){
      this.presentAlert('Creación de Tablas Donas', 'Error en crear las tablas que contienen las donas: ' + JSON.stringify(e));
    }
  }

  seleccionarDonas(){
    return this.basededatos.executeSql('SELECT * FROM donas', []).then(res=>{
      let items: Donas[] = [];
      if(res.rows.length > 0){
       for(var i=0; i < res.rows.length; i++){
         items.push({
          iddona: res.rows.item(i).iddona,
          imagen: res.rows.item(i).imagen,
          nombre: res.rows.item(i).nombre,
          precio: res.rows.item(i).precio,
          descripcion: res.rows.item(i).descripcion
          
         })
       }
       
      }
      this.listadoDonas.next(items as any);

   })
  }
  
  eliminarDona(id:string){
    return this.basededatos.executeSql('DELETE FROM donas WHERE iddona = ?',[id]).then(res=>{
      this.presentAlert("Eliminar","Dona Eliminada");
      this.seleccionarDonas();
    }).catch(e=>{
      this.presentAlert('Eliminar dona', 'Error: ' + JSON.stringify(e));
    })
  }

  modificarDona(id: number, imag: string, nom: string, prec: number,descrip: string){
    this.presentAlert("service","ID: " + id);
    return this.basededatos.executeSql('UPDATE donas SET imagen = ?, nombre = ?,precio = ?, descripcion= ?  WHERE iddona = ?',[imag,nom,prec,descrip,id]).then(res=>{
      this.presentAlert("Modificar","Dona Modificada");
      this.seleccionarDonas();
    }).catch(e=>{
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    })

  }

  insertarDona(imagen: string, nombre: string, precio: number,descripcion: string){
    return this.basededatos.executeSql('INSERT INTO donas(imagen, nombre, precio, descripcion) VALUES (?,?)',[imagen, nombre, precio, descripcion]).then(res=>{
      this.presentAlert("Insertar","Dona Registrada");
      this.seleccionarDonas();
    }).catch(e=>{
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    })
  }


}

