import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio de carrito

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
  isAuthorizedUser: boolean = false;

  constructor(
    private router: Router,
    private registrologinService: RegistrologinService,
    private alertController: AlertController,
    private carritoService: CarritoService
  ) {
    const user = this.registrologinService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.imagenAvatar = user.imagen || '';
      this.isLoggedIn = true;
    }
  }

  ngOnInit() {
    const user = this.registrologinService.getCurrentUser();
    if (user && user.username === 'christ' && user.email === 'ch.louidor@duocuc.cl') {
      this.isAuthorizedUser = true;
    }
  }

  goToSettings() {
    this.router.navigate(['/configuracion']); 
  }

  goToCompras() {
    this.router.navigate(['/mis-compras']); 
  }

  async logOut() {

    this.carritoService.vaciarCarrito();

    this.registrologinService.logOut();
    console.log('Sesión cerrada');

    const alert = await this.alertController.create({
      header: 'Sesión cerrada',
      message: 'Has cerrado sesión correctamente.',
      buttons: ['Aceptar']
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      this.router.navigate(['/inicio']);
    });
  }

  goToDonas() {
    this.router.navigate(['/lista-donas']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
