import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  register() {
    if (this.password === this.confirmPassword) {
      console.log('Usuario registrado:', this.username);
      // Lógica para registrar al usuario
      this.router.navigate(['/login']); // Redirige a la página de inicio de sesión después del registro
    } else {
      console.error('Las contraseñas no coinciden');
    }
  }
}
