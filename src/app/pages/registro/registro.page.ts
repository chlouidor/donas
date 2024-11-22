import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  confirmPasswordError: boolean = false;

  pregunta1: string = '';
  respuesta1: string = '';
  pregunta2: string = '';
  respuesta2: string = '';
  pregunta3: string = '';
  respuesta3: string = '';

  constructor(
    private registrologinService: RegistrologinService,
    private router: Router,
    private alertController: AlertController
  ) {}

  convertToLower(event: any, fieldName: 'respuesta1' | 'respuesta2' | 'respuesta3') {
    const value = event.target.value.toLowerCase();
    this[fieldName] = value; 
  }
  async registrar() {
    // Validaciones de campos
    if (this.username.trim() === '') {
      this.showAlert('Error', 'El campo de nombre de usuario no puede estar vacío.');
      return;
    }
  
    if (this.email.trim() === '') {
      this.showAlert('Error', 'El campo de correo electrónico no puede estar vacío.');
      return;
    }
  
    // Validación de email
    if (!this.validateEmail(this.email)) {
      this.showAlert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }
  
    if (this.password.trim() === '') {
      this.showAlert('Error', 'El campo de contraseña no puede estar vacío.');
      return;
    }
  
    if (this.password.length < 6) {
      this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
  
    if (!this.hasNumber(this.password)) {
      this.showAlert('Error', 'La contraseña debe contener al menos un número.');
      return;
    }
  
    this.confirmPasswordError = this.password !== this.confirmPassword;
    if (this.confirmPasswordError) {
      this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    // Verificar usuario único antes de las preguntas de seguridad
    const { usernameEnUso, emailEnUso } = await this.registrologinService.verificarUsuarioUnico(this.username, this.email);
    if (usernameEnUso) {
      this.showAlert('Error', 'El nombre de usuario ya está en uso.');
      return;
    } else if (emailEnUso) {
      this.showAlert('Error', 'El correo electrónico ya está en uso.');
      return;
    }
  
    // Validación de preguntas de seguridad
    if (!this.pregunta1 || !this.respuesta1.trim()) {
      this.showAlert('Error', 'La pregunta de seguridad 1 y su respuesta no pueden estar vacías.');
      return;
    }
  
    if (!this.pregunta2 || !this.respuesta2.trim()) {
      this.showAlert('Error', 'La pregunta de seguridad 2 y su respuesta no pueden estar vacías.');
      return;
    }
  
    if (!this.pregunta3 || !this.respuesta3.trim()) {
      this.showAlert('Error', 'La pregunta de seguridad 3 y su respuesta no pueden estar vacías.');
      return;
    }
  
    try {
      // Registrar usuario si todas las validaciones son correctas
      await this.registrologinService.registrarUsuario(
        this.username,
        this.email,
        this.password,
        this.pregunta1,
        this.respuesta1,
        this.pregunta2,
        this.respuesta2,
        this.pregunta3,
        this.respuesta3
      );
  
      this.showAlert('Éxito', 'Tu cuenta fue registrada correctamente.');
      this.router.navigate(['/login']);
    } catch (error: unknown) {
      console.error('Error al registrar el usuario:', error);
  
      if (error instanceof Error) {
        this.showAlert('Error', `Ocurrió un error al registrar el usuario: ${error.message}`);
      } else if (typeof error === 'string') {
        this.showAlert('Error', `Error: ${error}`);
      } else if (error && typeof (error as { message: string }).message === 'string') {
        this.showAlert('Error', `Ocurrió un error: ${(error as { message: string }).message}`);
      } else {
        this.showAlert('Error', 'Ocurrió un error desconocido al registrar el usuario.');
      }
    }
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Función para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Validar formato del correo electrónico
  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  hasNumber(password: string): boolean {
    const numberRegex = /\d/;
    return numberRegex.test(password);
  }
}