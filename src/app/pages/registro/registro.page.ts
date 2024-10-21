import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular'; // Importar AlertController

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

  constructor(private registrologinService: RegistrologinService, private router: Router, private alertController: AlertController) {}

  async registrar() {
    // Validaciones
    if (this.username.trim() === '') {
      this.showAlert('Error', 'El campo de nombre de usuario no puede estar vacío.');
      return;
    }

    if (this.email.trim() === '') {
      this.showAlert('Error', 'El campo de correo electrónico no puede estar vacío.');
      return;
    }

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

    try {
      await this.registrologinService.registrarUsuario(this.username, this.email, this.password);
      console.log('Registro exitoso');
      this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión después del registro
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      this.showAlert('Error', 'Ocurrió un error al registrar el usuario.'); // Mensaje para el usuario
    }
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
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

  // Verificar si la contraseña contiene al menos un número
  hasNumber(password: string): boolean {
    const numberRegex = /\d/; // Expresión regular para verificar números
    return numberRegex.test(password);
  }
}