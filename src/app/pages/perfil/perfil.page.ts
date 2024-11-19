import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service'; 
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

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
  isAdmin: boolean = false; 
  hideSettingsButton: boolean = false;

  constructor(
    private router: Router,
    private registrologinService: RegistrologinService,
    private alertController: AlertController,
    private carritoService: CarritoService,
    private nativeStorage: NativeStorage
  ) {
    const user = this.registrologinService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.imagenAvatar = user.imagen || '';
      this.isLoggedIn = true;
  
      this.isAdmin = user.rol === 'admin'; 
    }
  }

  goToSettings() {
    this.router.navigate(['/configuracion']); 
  }

  goToCompras() {
    this.router.navigate(['/mis-compras']); 
  }

  async logOut() {
    try {
      await this.nativeStorage.remove('ultimoUsuario');
      console.log('Datos del usuario eliminados del almacenamiento nativo.');
  
      this.carritoService.vaciarCarrito();
  
      this.registrologinService.logOut();
      console.log('Sesión cerrada');
  
      const alert = await this.alertController.create({
        header: 'Sesión cerrada',
        message: 'Has cerrado sesión correctamente.',
        buttons: ['Aceptar'],
      });
  
      await alert.present();
  
      alert.onDidDismiss().then(() => {
        this.router.navigate(['/inicio']);
      });
    } catch (error) {
      console.error('Error al eliminar los datos del usuario:', error);
    }
  }

  goToDonas() {
    this.router.navigate(['/lista-donas']);
  }

  goToHistorial() {
    this.router.navigate(['/historial']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
