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
        await this.registrologinService.actualizarUsuario(this.username!, this.email!);
        
       
        if (this.imagenAvatar) {
          user.imagen = this.imagenAvatar; 
          await this.registrologinService.actualizarUsuario(this.username!, this.email!);
        }

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Tus datos han sido actualizados correctamente.',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/inicio']);
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      this.updateError = true;
    }
  }

  async chooseImageSource() {
    const alert = await this.alertController.create({
      header: 'Seleccionar fuente de imagen',
      buttons: [
        {
          text: 'Cámara',
          handler: async () => {
            await this.requestCameraPermissions();
            await this.selectImage(CameraSource.Camera);
          }
        },
        {
          text: 'Galería',
          handler: async () => {
            await this.requestCameraPermissions();
            await this.selectImage(CameraSource.Photos);
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

  async requestCameraPermissions() {
    try {
      const permissionStatus = await Camera.requestPermissions();

      if (permissionStatus.camera !== 'granted' || permissionStatus.photos !== 'granted') {
        const alert = await this.alertController.create({
          header: 'Permisos denegados',
          message: 'Los permisos para la cámara y/o la galería son necesarios para esta funcionalidad.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  }

  async selectImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source
      });

      // Muestra la imagen
      this.imagenAvatar = image.webPath; 

      const user = this.registrologinService.getCurrentUser();
      if (user) {
        user.imagen = this.imagenAvatar; // Actualiza la imagen del usuario
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  }
}
