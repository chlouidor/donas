import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrologinService {
  private basededatos?: SQLiteObject; // Hacerla opcional
  private listadoUsuarios: BehaviorSubject<{ username: string; email: string; password: string; }[]> = new BehaviorSubject<{ username: string; email: string; password: string; }[]>([]);

  constructor(private sqlite: SQLite) {
    this.iniciarBaseDeDatos();
  }

  async iniciarBaseDeDatos() {
    try {
      const db = await this.sqlite.create({
        name: 'usuarios.db',
        location: 'default'
      });

      this.basededatos = db;

      await this.basededatos.executeSql(`CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          email TEXT,
          password TEXT
        )
      `, []);

      console.log('Base de datos iniciada y tabla usuarios creada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  async registrarUsuario(username: string, email: string, password: string): Promise<void> {
    try {
      await this.basededatos?.executeSql(`INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)`, [username, email, password]);
      console.log('Usuario registrado con éxito');
      // Actualiza el listado de usuarios
      this.listadoUsuarios.next(await this.obtenerUsuarios());
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  async loginUsuario(email: string, password: string): Promise<boolean> {
    try {
      const result = await this.basededatos?.executeSql(`SELECT * FROM usuarios WHERE email = ? AND password = ?`, [email, password]);

      const usuarios = [];
      for (let i = 0; i < result?.rows.length; i++) {
        usuarios.push(result.rows.item(i));
      }

      return usuarios.length > 0; // Devuelve true si se encuentra algún usuario que coincida
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      return false;
    }
  }

  async obtenerUsuarios(): Promise<{ username: string; email: string; password: string; }[]> {
    try {
      const result = await this.basededatos?.executeSql(`SELECT * FROM usuarios`, []);
      const usuarios = [];
      for (let i = 0; i < result?.rows.length; i++) {
        usuarios.push(result.rows.item(i));
      }
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }
}
