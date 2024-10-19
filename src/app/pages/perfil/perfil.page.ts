import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular'; // Importa AlertController

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

  constructor(
    private router: Router,
    private registrologinService: RegistrologinService,
    private alertController: AlertController // Inyecta AlertController
  ) {
    const user = this.registrologinService.getCurrentUser(); // Obtiene el usuario actual
    if (user) {
      this.username = user.username; // Asigna el nombre de usuario
      this.email = user.email; // Asigna el correo electrónico
      this.imagenAvatar = user.imagen || ''; // Asigna la imagen del avatar si existe
      this.isLoggedIn = true; 
    }
  }

  goToSettings() {
    this.router.navigate(['/configuracion']); 
  }
  
  goToCompras() {
    this.router.navigate(['/mis-compras']); 
  }

  async logOut() {
   
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

  goToLogin() {
    this.router.navigate(['/login']); 
  }
}
