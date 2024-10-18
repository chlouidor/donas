import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class RegistrologinService {
  private basededatos?: SQLiteObject;
  private currentUser: { id: number; username: string; email: string; imagen?: string } | null = null; // Almacena el usuario actual

  constructor(private sqlite: SQLite) {
    this.iniciarBaseDeDatos();
  }

  // Inicializa la base de datos y crea la tabla si no existe
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
          email TEXT UNIQUE,
          password TEXT,
          imagen TEXT
        )`, []);

      console.log('Base de datos iniciada y tabla usuarios creada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  // Registra un nuevo usuario en la base de datos
  async registrarUsuario(username: string, email: string, password: string): Promise<void> {
    try {
      await this.basededatos?.executeSql(`INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)`, [username, email, password]);
      console.log('Usuario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }

  // Inicia sesión verificando las credenciales del usuario
  async loginUsuario(email: string, password: string): Promise<boolean> {
    try {
      const result = await this.basededatos?.executeSql(`SELECT * FROM usuarios WHERE email = ? AND password = ?`, [email, password]);
      
      if (result?.rows.length > 0) {
        this.currentUser = result.rows.item(0); // Almacena el usuario actual
        return true; // Usuario encontrado
      } else {
        return false; // Usuario no encontrado
      }
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      return false;
    }
  }

  // Obtiene el usuario actual
  getCurrentUser() {
    return this.currentUser; // Método para obtener el usuario actual
  }

  // Desconecta al usuario actual
  logOut() {
    this.currentUser = null; // Desconectar usuario
  }

  // Actualiza los datos del usuario en la base de datos
  async actualizarUsuario(username: string, email: string, imagen?: string): Promise<void> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');

    try {
      await this.basededatos?.executeSql(`UPDATE usuarios SET username = ?, email = ?, imagen = ? WHERE id = ?`, [username, email, imagen || null, this.currentUser.id]);
      
      // Actualiza los datos del usuario actual en el servicio
      this.currentUser.username = username;
      this.currentUser.email = email;
      if (imagen) {
        this.currentUser.imagen = imagen; // Actualiza también la imagen en el servicio
      }

      console.log('Usuario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }
}