import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  username: string | undefined;
  email: string | undefined;
  imagenAvatar: string | undefined;
  updateError: boolean = false;

  constructor(
    private router: Router,
    private registrologinService: RegistrologinService,
    private alertController: AlertController
  ) {}

  hasNumber(str: string): boolean {
    return /\d/.test(str);
  }

  ngOnInit() {
    const user = this.registrologinService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.imagenAvatar = user.imagen || '';
    }
  }

  async actualizarDatos() {
    try {
      const user = this.registrologinService.getCurrentUser();
      if (user) {
        const { usernameEnUso, emailEnUso } = await this.registrologinService.verificarUsuarioUnico(this.username!, this.email!);

        if (usernameEnUso && this.username !== user.username) {
          await this.showAlert('Error', 'El nombre de usuario ya está en uso.');
          return;
        }
        if (emailEnUso && this.email !== user.email) {
          await this.showAlert('Error', 'El correo electrónico ya está en uso.');
          return;
        }

        await this.registrologinService.actualizarUsuario(this.username!, this.email!);

        if (this.imagenAvatar) {
          user.imagen = this.imagenAvatar; 
          await this.registrologinService.actualizarUsuario(this.username!, this.email!);
        }

        await this.showAlert('Éxito', 'Tus datos han sido actualizados correctamente.');
        this.router.navigate(['/inicio']);
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      this.updateError = true;
      await this.showAlert('Error', 'No se pudieron actualizar los datos. Inténtalo de nuevo.');
    }
  }
  
  async chooseImageSource() {
    const alert = await this.alertController.create({
      header: 'Seleccionar fuente de imagen',
      buttons: [
        {
          text: 'Cámara',
          handler: async () => {
            const permissionGranted = await this.requestCameraPermissions();
            if (permissionGranted) {
              await this.selectImage(CameraSource.Camera);
            }
          }
        },
        {
          text: 'Galería',
          handler: async () => {
            const permissionGranted = await this.requestCameraPermissions();
            if (permissionGranted) {
              await this.selectImage(CameraSource.Photos);
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
  }
  
  async requestCameraPermissions(): Promise<boolean> {
    try {
      const permissionStatus = await Camera.requestPermissions();
  
      if (permissionStatus.camera === 'granted' && permissionStatus.photos === 'granted') {
        return true;
      } else {
        await this.showAlert('Permisos denegados', 'Los permisos para la cámara y/o la galería son necesarios para esta funcionalidad.');
        return false;
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      await this.showAlert('Error', 'No se pudieron obtener los permisos necesarios.');
      return false;
    }
  }

  async selectImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source
      });

      this.imagenAvatar = image.webPath; 
      const user = this.registrologinService.getCurrentUser();
      if (user) {
        user.imagen = this.imagenAvatar;
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      await this.showAlert('Error', 'No se pudo seleccionar la imagen.');
    }
  }

  async cambiarContrasena() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'nuevaContrasena',
          type: 'password',
          placeholder: 'Nueva Contraseña'
        },
        {
          name: 'confirmarContrasena',
          type: 'password',
          placeholder: 'Confirmar Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            const nuevaContrasena = data.nuevaContrasena;
            const confirmarContrasena = data.confirmarContrasena;
  
            if (nuevaContrasena.trim() === '') {
              await this.showAlert('Error', 'El campo de contraseña no puede estar vacío.');
              return;
            }
  
            if (nuevaContrasena.length < 6) {
              await this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
              return;
            }
  
            if (!this.hasNumber(nuevaContrasena)) {
              await this.showAlert('Error', 'La contraseña debe contener al menos un número.');
              return;
            }
  
            if (nuevaContrasena !== confirmarContrasena) {
              await this.showAlert('Error', 'Las contraseñas no coinciden.');
              return;
            }
  
            try {
              await this.registrologinService.cambiarContrasena(this.username!, nuevaContrasena);
              await this.showAlert('Éxito', 'Contraseña cambiada exitosamente.');
            } catch (error) {
              console.error('Error al cambiar la contraseña:', error);
              await this.showAlert('Error', 'No se pudo cambiar la contraseña. Inténtalo nuevamente.');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  isUserLoggedIn(): boolean {
    return this.registrologinService.getCurrentUser() !== null;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
