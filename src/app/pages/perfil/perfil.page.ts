import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  username: string | undefined;
  email: string | undefined;
  imagenAvatar: string | undefined;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false; // Variable para verificar si el usuario es admin

  constructor(private router: Router, private registrologinService: RegistrologinService, private toastController: ToastController) {
    const user = this.registrologinService.getCurrentUser();
    
    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.imagenAvatar = user.imagen || '';
      this.isLoggedIn = true;

      // Verificar si el usuario es admin
      this.isAdmin = user.rol === 2; // Suponiendo que '2' es el rol para admin
    }
  }

  goToSettings() {
    this.router.navigate(['/configuracion']);
  }

  async logOut() {
    this.registrologinService.logOut();
    console.log('Sesión cerrada');

    const toast = await this.toastController.create({
      message: 'Has cerrado sesión correctamente.',
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();

    this.router.navigate(['/inicio']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToDonas() {
    this.router.navigate(['/lista-donas']); 
  }

  goToCompras() {
    this.router.navigate(['/compras']);
  }
}