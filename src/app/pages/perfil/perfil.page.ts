import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  username: string | undefined;
  email: string | undefined;
  imagenAvatar: string | undefined; // Variable para almacenar la imagen del avatar
  isLoggedIn: boolean = false; // Verifica si el usuario está logueado

  constructor(private router: Router, private registrologinService: RegistrologinService) {
    const user = this.registrologinService.getCurrentUser(); // Obtiene el usuario actual
    if (user) {
      this.username = user.username; // Asigna el nombre de usuario
      this.email = user.email; // Asigna el correo electrónico
      this.imagenAvatar = user.imagen || ''; // Asigna la imagen del avatar si existe
      this.isLoggedIn = true; // Indica que el usuario está logueado
    }
  }

  goToSettings() {
    this.router.navigate(['/configuracion']); // Navega a la página de configuración
  }
  goToCompras(){
    this.router.navigate(['/mis-compras']); // Navega a la página de configuración
  }

  logOut() {
    // Lógica para cerrar sesión
    this.registrologinService.logOut(); // Desconecta al usuario en el servicio
    console.log('Sesión cerrada');
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }


  goToLogin() {
    this.router.navigate(['/login']); // Redirigir al login
  }
}