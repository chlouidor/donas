import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class RegistrologinService {
  private basededatos?: SQLiteObject;
  private currentUser: { id: number; username: string; email: string; imagen?: string } | null = null;

  constructor(private sqlite: SQLite, private nativeStorage: NativeStorage) {
    this.iniciarBaseDeDatos();
  }

  async iniciarBaseDeDatos() {
    try {
      const db = await this.sqlite.create({
        name: 'usuarios.db',
        location: 'default',
      });

      this.basededatos = db;

  
      await this.basededatos.executeSql(
        `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          email TEXT UNIQUE,
          password TEXT,
          imagen TEXT,
          pregunta1 TEXT,
          respuesta1 TEXT,
          pregunta2 TEXT,
          respuesta2 TEXT,
          pregunta3 TEXT,
          respuesta3 TEXT
        )`,
        []
      );
      
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  async registrarUsuario(
    username: string, 
    email: string, 
    password: string, 
    pregunta1: string, 
    respuesta1: string, 
    pregunta2: string, 
    respuesta2: string, 
    pregunta3: string, 
    respuesta3: string
  ): Promise<void> {
    try {
      const { usernameEnUso, emailEnUso } = await this.verificarUsuarioUnico(username, email);

      if (usernameEnUso || emailEnUso) {
        throw new Error('El nombre de usuario o el correo electrónico ya están en uso.');
      }

      console.log('Registrando usuario con los siguientes datos:', {
        username, email, password, pregunta1, respuesta1, pregunta2, respuesta2, pregunta3, respuesta3
      });

      await this.basededatos?.executeSql(
        `INSERT INTO usuarios (username, email, password, pregunta1, respuesta1, pregunta2, respuesta2, pregunta3, respuesta3) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, email, password, pregunta1, respuesta1, pregunta2, respuesta2, pregunta3, respuesta3]
      );

      console.log('Usuario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

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

  
  
  

  
  async loginUsuario(email: string, password: string): Promise<boolean> {
    try {
      const result = await this.basededatos?.executeSql(
        `SELECT * FROM usuarios WHERE email = ? AND password = ?`,
        [email, password]
      );

      if (result?.rows.length > 0) {
        this.currentUser = result.rows.item(0);

        
        await this.nativeStorage.setItem('currentUser', this.currentUser);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      return false;
    }
  }

  
  getCurrentUser() {
    return this.currentUser;
  }

  
  async logOut() {
    this.currentUser = null;
    await this.nativeStorage.remove('currentUser');
  }

  async restoreSession(): Promise<boolean> {
    try {
      const user = await this.nativeStorage.getItem('currentUser');
      if (user) {
        this.currentUser = user;
        return true;
      }
    } catch (error) {
      console.log('No hay usuario guardado en NativeStorage.');
    }
    return false;
  }

  
  async actualizarUsuario(username: string, email: string): Promise<void> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');
  
    try {
      
      const { usernameEnUso, emailEnUso } = await this.verificarUsuarioUnico(username, email);
  
      if (usernameEnUso && username !== this.currentUser.username) {
        throw new Error('El nombre de usuario ya está en uso.');
      }
      if (emailEnUso && email !== this.currentUser.email) {
        throw new Error('El correo electrónico ya está en uso.');
      }
  
      
      await this.basededatos?.executeSql(
        `UPDATE usuarios SET username = ?, email = ? WHERE id = ?`,
        [username, email, this.currentUser.id]
      );
  
     
      this.currentUser.username = username;
      this.currentUser.email = email;
  
      console.log('Usuario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  

  
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

  async recuperarContrasena(email: string, pregunta: string, respuesta: string): Promise<boolean> {
    try {
      const result = await this.basededatos?.executeSql(
        `SELECT * FROM usuarios WHERE email = ? AND ((pregunta1 = ? AND respuesta1 = ?) OR (pregunta2 = ? AND respuesta2 = ?) OR (pregunta3 = ? AND respuesta3 = ?))`,
        [email, pregunta, respuesta, pregunta, respuesta, pregunta, respuesta]
      );
  
      return result?.rows.length > 0;
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      return false;
    }
  }
  
  async cambiarContrasenaPorEmail(email: string, nuevaContrasena: string): Promise<void> {
    try {
      await this.basededatos?.executeSql(
        `UPDATE usuarios SET password = ? WHERE email = ?`,
        [nuevaContrasena, email]
      );
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  async obtenerPreguntasPorEmail(email: string): Promise<any> {
    try {
      
      const result = await this.basededatos?.executeSql(
        `SELECT pregunta1, respuesta1, pregunta2, respuesta2, pregunta3, respuesta3 
         FROM usuarios WHERE email = ?`, 
        [email]
      );
  
      if (result?.rows.length > 0) {
       
        const usuario = result.rows.item(0);
        
        const preguntas = [
          { pregunta: usuario.pregunta1, respuesta: usuario.respuesta1 },
          { pregunta: usuario.pregunta2, respuesta: usuario.respuesta2 },
          { pregunta: usuario.pregunta3, respuesta: usuario.respuesta3 }
        ];
  
        
        const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
        return { pregunta: preguntaAleatoria.pregunta, opciones: preguntaAleatoria.respuesta };
      } else {
        throw new Error('Correo no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener preguntas por email:', error);
      throw error;
    }
  }
  
  
  
}


