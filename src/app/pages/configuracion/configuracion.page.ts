import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Importar Camera

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  username: string | undefined;
  email: string | undefined;
  imagenAvatar: string | undefined; // Variable para almacenar la imagen del avatar
  updateError: boolean = false;

  constructor(private router: Router, private registrologinService: RegistrologinService) {}

  ngOnInit() {
    const user = this.registrologinService.getCurrentUser(); // Obtiene el usuario actual
    if (user) {
      this.username = user.username; // Asigna el nombre de usuario
      this.email = user.email; // Asigna el correo electrónico
      this.imagenAvatar = user.imagen || ''; // Asigna la imagen del avatar si existe
    }
  }

  async actualizarDatos() {
    try {
      const user = this.registrologinService.getCurrentUser();
      if (user) {
        // Solo actualiza si hay un usuario logueado
        await this.registrologinService.actualizarUsuario(this.username!, this.email!); // Actualiza los datos en el servicio
        console.log('Datos actualizados con éxito');
        this.router.navigate(['/inicio']); // Redirigir a la página de inicio después de actualizar
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      this.updateError = true; // Muestra un mensaje de error si falla la actualización
    }
  }

  // Función para seleccionar imagen desde el dispositivo
  selectImage = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
  
    this.imagenAvatar = image.webPath; // Asigna la imagen seleccionada a la variable
  
    const user = this.registrologinService.getCurrentUser();
    if (user) {
      user.imagen = this.imagenAvatar; // Actualiza la propiedad imagen del usuario actual
      await this.registrologinService.actualizarUsuario(this.username!, this.email!); // Actualiza los datos en el servicio con la nueva imagen
    }

  
    this.router.navigate(['/inicio']); // Redirigir a la página de inicio después de seleccionar la imagen
  };

  goToDonas(){
    this.router.navigate(['/lista-donas']); 
  }
}