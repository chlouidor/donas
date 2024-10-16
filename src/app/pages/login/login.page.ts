import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { ToastController } from '@ionic/angular'; // Importar ToastController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router, private registrologinService: RegistrologinService, private toastController: ToastController) {}

  async login() {
    console.log('Intentando iniciar sesión con:', this.email, this.password); // Mensaje para depuración
    const isValid = await this.registrologinService.loginUsuario(this.email, this.password);
    
    if (!isValid) {
      this.loginError = true; // Muestra un mensaje si las credenciales son incorrectas
      console.log('Credenciales incorrectas'); // Mensaje para depuración
    } else {
      this.loginError = false; // Resetea el error si las credenciales son correctas
      console.log('Inicio de sesión exitoso'); // Mensaje para depuración
      
      // Mostrar mensaje de éxito
      const toast = await this.toastController.create({
        message: 'Has iniciado sesión correctamente.',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      toast.present();

      this.router.navigate(['/inicio']); // Redirige a la página de inicio después del inicio de sesión
    }
  }

  goToRegister() {
    this.router.navigate(['/registro']); // Redirige a la página de registro
  }
}