import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router, private registrologinService: RegistrologinService, private alertController: AlertController, private nativeStorage: NativeStorage) {}

  async login() {
    // Validaciones
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
  
    console.log('Intentando iniciar sesión con:', this.email, this.password);
    const isValid = await this.registrologinService.loginUsuario(this.email, this.password);
    
    if (!isValid) {
      this.loginError = true;
      console.log('Credenciales incorrectas');
      this.showAlert('Error', 'Credenciales incorrectas.'); 
    } else {
      this.loginError = false;
      console.log('Inicio de sesión exitoso');
      
      
      const currentUser = this.registrologinService.getCurrentUser(); 
      if (currentUser) {
        try {
          await this.nativeStorage.setItem('ultimoUsuario', {
            username: currentUser.username,
            email: currentUser.email,
            imagen: currentUser.imagen || 'default-avatar-url',
          });
          console.log('Usuario logueado guardado en Native Storage:', currentUser);
        } catch (error) {
          console.error('Error al guardar datos del usuario en Native Storage:', error);
        }
      }
  
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Has iniciado sesión correctamente.',
        buttons: ['OK']
      });
      await alert.present();
  
      this.router.navigate(['/inicio']);
    }
  }
  

  goToRegister() {
    this.router.navigate(['/registro']);
  }

  goToRecuperar(){
    this.router.navigate(['/recuperar']);
  }

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