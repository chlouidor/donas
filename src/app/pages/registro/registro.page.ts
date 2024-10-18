import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';

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

  constructor(private registrologinService: RegistrologinService, private router: Router) {}

  async registrar() {
    // Verifica si las contraseñas coinciden
    this.confirmPasswordError = this.password !== this.confirmPassword;

    if (!this.confirmPasswordError) {
      try {
        await this.registrologinService.registrarUsuario(this.username, this.email, this.password);
        console.log('Registro exitoso');
        this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión después del registro
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }
}