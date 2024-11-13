import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class RegistrologinService {
  private basededatos?: SQLiteObject;
  private currentUser: { id: number; username: string; email: string; imagen?: string } | null = null;

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

      await this.basededatos.executeSql(
        `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          email TEXT UNIQUE,
          password TEXT,
          imagen TEXT
        )`,
        []
      );

      console.log('Base de datos iniciada y tabla usuarios creada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  // Método para verificar si el username o email ya existen
  async verificarUsuarioUnico(username: string, email: string): Promise<{ usernameEnUso: boolean; emailEnUso: boolean }> {
    try {
      const result = await this.basededatos?.executeSql(
        `SELECT * FROM usuarios WHERE username = ? OR email = ?`,
        [username, email]
      );
  
      const usernameEnUso = Array.from({ length: result?.rows.length || 0 }).some(
        (_, i) => result?.rows.item(i).username === username
      );
  
      const emailEnUso = Array.from({ length: result?.rows.length || 0 }).some(
        (_, i) => result?.rows.item(i).email === email
      );
  
      return { usernameEnUso, emailEnUso };
    } catch (error) {
      console.error('Error al verificar usuario único:', error);
      throw error;
    }
  }
  

  // Registra un nuevo usuario en la base de datos, con verificación de unicidad
  async registrarUsuario(username: string, email: string, password: string): Promise<void> {
    try {
      const { usernameEnUso, emailEnUso } = await this.verificarUsuarioUnico(username, email);
      
      if (usernameEnUso || emailEnUso) {
        throw new Error('El nombre de usuario o el correo electrónico ya están en uso.');
      }
  
      await this.basededatos?.executeSql(
        `INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)`,
        [username, email, password]
      );
      console.log('Usuario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }
  

  // Inicia sesión verificando las credenciales del usuario
  async loginUsuario(email: string, password: string): Promise<boolean> {
    try {
      const result = await this.basededatos?.executeSql(
        `SELECT * FROM usuarios WHERE email = ? AND password = ?`,
        [email, password]
      );

      if (result?.rows.length > 0) {
        this.currentUser = result.rows.item(0);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      return false;
    }
  }

  // Obtiene el usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Desconecta al usuario actual
  logOut() {
    this.currentUser = null;
  }

  // Actualiza los datos del usuario en la base de datos
  async actualizarUsuario(username: string, email: string): Promise<void> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');
  
    try {
      // Verificar si el nuevo username o email están en uso, solo si son diferentes del actual
      const { usernameEnUso, emailEnUso } = await this.verificarUsuarioUnico(username, email);
  
      if (usernameEnUso && username !== this.currentUser.username) {
        throw new Error('El nombre de usuario ya está en uso.');
      }
      if (emailEnUso && email !== this.currentUser.email) {
        throw new Error('El correo electrónico ya está en uso.');
      }
  
      // Procede con la actualización si no hay conflictos
      await this.basededatos?.executeSql(
        `UPDATE usuarios SET username = ?, email = ? WHERE id = ?`,
        [username, email, this.currentUser.id]
      );
  
      // Actualiza los datos del usuario actual en el servicio
      this.currentUser.username = username;
      this.currentUser.email = email;
  
      console.log('Usuario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  

  // Cambia la contraseña del usuario en la base de datos
  async cambiarContrasena(username: string, nuevaContrasena: string): Promise<void> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');

    try {
      await this.basededatos?.executeSql(
        `UPDATE usuarios SET password = ? WHERE id = ?`,
        [nuevaContrasena, this.currentUser.id]
      );
      console.log('Contraseña actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error;
    }
  }
}


