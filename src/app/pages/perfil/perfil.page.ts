import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {

  username: string = 'Usuario Ejemplo'; // Datos de ejemplo
  email: string = 'usuario@ejemplo.com';

  constructor(private router: Router) {}

  goToSettings() {
    this.router.navigate(['/configuracion']); // Navega a la página de configuración
  }

  logOut() {
    // Lógica para cerrar sesión
    console.log('Sesión cerrada');
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }
}
