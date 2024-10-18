import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { ToastController } from '@ionic/angular'; // Importar ToastController

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  username: string | undefined;
  email: string | undefined;
  imagenAvatar: string | undefined; // Variable para almacenar la imagen del avatar
  selectedImage: string | undefined; // Variable para almacenar la imagen seleccionada
  isLoggedIn: boolean = false; // Verifica si el usuario está logueado

  constructor(private router: Router, private registrologinService: RegistrologinService, private toastController: ToastController) {
    this.cargarUsuario(); // Carga la información del usuario al inicializar
  }

  cargarUsuario() {
    const user = this.registrologinService.getCurrentUser(); // Obtiene el usuario actual
    if (user) {
      this.username = user.username; // Asigna el nombre de usuario
      this.email = user.email; // Asigna el correo electrónico
      this.imagenAvatar = user.imagen || ''; // Asigna la imagen del avatar si existe
      this.isLoggedIn = true; // Indica que el usuario está logueado
    } else {
      console.warn('No hay usuario logueado'); // Mensaje de advertencia si no hay usuario
    }
  }

  cambiarImagen(event: any) {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string; // Actualiza la vista con la nueva imagen seleccionada
      };
      reader.readAsDataURL(file); // Lee el archivo como URL de datos
    }
  }

  async actualizarPerfil() {
    try {
      await this.registrologinService.actualizarUsuario(this.username!, this.email!, this.selectedImage); // Actualiza en el servicio
      console.log('Perfil actualizado con éxito');

      // Mostrar mensaje de éxito al actualizar el perfil
      const toast = await this.toastController.create({
        message: 'Perfil cambiado correctamente.',
        duration: 3000, // Duración del mensaje (en milisegundos)
        position: 'middle', // Posición del mensaje en la pantalla
        color: 'success' // Color del toast
      });
      toast.present();

      this.router.navigate(['/inicio']); // Redirige a la página de inicio después de actualizar el perfil
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      const toast = await this.toastController.create({
        message: 'Error al actualizar el perfil. Intenta nuevamente.',
        duration: 3000,
        position: 'middle',
        color: 'danger'
      });
      toast.present();
    }
  }

  async logOut() { // Marcar como async aquí
    this.registrologinService.logOut(); // Desconecta al usuario en el servicio
    console.log('Sesión cerrada');

    // Mostrar mensaje de éxito al cerrar sesión
    const toast = await this.toastController.create({
      message: 'Has cerrado sesión correctamente.',
      duration: 3000,
      position: 'middle',
      color: 'success'
    });
    toast.present();

    this.router.navigate(['/inicio']); // Redirige a la página de inicio después de cerrar sesión
  }

  goToSettings() {
    this.router.navigate(['/configuracion']); // Navega a la página de configuración
  }

  goToCompras() {
    this.router.navigate(['/mis-compras']); // Navega a la página de compras
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirigir al login
  }
}