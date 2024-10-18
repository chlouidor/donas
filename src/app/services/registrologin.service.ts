import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class RegistrologinService {
  private basededatos?: SQLiteObject;
  private currentUser: { id: number; username: string; email: string; imagen?: string; rol: number } | null = null;

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

      // Crear tabla de roles
      await this.basededatos.executeSql(`CREATE TABLE IF NOT EXISTS roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT UNIQUE NOT NULL
        )`, []);
      
      // Insertar roles (usuario y admin) solo si no existen
      await this.basededatos.executeSql(`INSERT INTO roles (nombre) VALUES ('usuario'), ('admin') ON CONFLICT(nombre) DO NOTHING`, []);

      // Crear tabla de usuarios
      await this.basededatos.executeSql(`CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          email TEXT UNIQUE,
          password TEXT,
          imagen TEXT,
          rol INTEGER DEFAULT 1 REFERENCES roles(id)
        )`, []);

      console.log('Base de datos iniciada y tablas creadas.');

      // Registrar administrador si no existe
      await this.registrarAdmin();

    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  // Método para registrar un nuevo usuario
  async registrarUsuario(username: string, email: string, password: string, rol: number): Promise<void> {
    try {
      console.log('Verificando si el correo electrónico ya está en uso...');
      const result = await this.basededatos?.executeSql(`SELECT * FROM usuarios WHERE email = ?`, [email]);
      
      if (result?.rows.length > 0) {
        console.error('El correo electrónico ya está en uso.');
        throw new Error('El correo electrónico ya está en uso.');
      }

      console.log('Registrando nuevo usuario...');
      await this.basededatos?.executeSql(`INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)`, [username, email, password, rol]);
      console.log('Usuario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }

  // Método para registrar un administrador
  async registrarAdmin() {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'asdqwe123';
    const adminUsername = 'Admin'; // Nombre de usuario para el admin
    const adminRoleId = 2; // Suponiendo que '2' es el rol para admin

    try {
      const result = await this.basededatos?.executeSql(`SELECT * FROM usuarios WHERE email = ?`, [adminEmail]);
      
      if (result?.rows.length === 0) { // Solo registrar si no existe
        await this.basededatos?.executeSql(`INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)`, [adminUsername, adminEmail, adminPassword, adminRoleId]);
        console.log('Administrador registrado con éxito');
      } else {
        console.log('El administrador ya existe en la base de datos.');
      }
    } catch (error) {
      console.error('Error al registrar el administrador:', error);
    }
  }

  // Método para obtener el usuario actual
  getCurrentUser() {
    return this.currentUser; // Retorna el usuario actual
  }

  // Método para iniciar sesión
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

  // Método para cerrar sesión
  logOut() {
    this.currentUser = null; // Desconectar usuario
  }

  // Método para actualizar los datos del usuario
  async actualizarUsuario(username: string, email: string): Promise<void> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');

    try {
      await this.basededatos?.executeSql(`UPDATE usuarios SET username = ?, email = ? WHERE id = ?`, [username, email, this.currentUser.id]);
      
      // Actualiza los datos del usuario actual en el servicio
      this.currentUser.username = username;
      this.currentUser.email = email;

      console.log('Usuario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }
}