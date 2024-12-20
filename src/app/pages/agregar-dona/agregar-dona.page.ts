import { Component, OnInit } from '@angular/core';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router'; 
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';  

@Component({
  selector: 'app-agregar-dona',
  templateUrl: './agregar-dona.page.html',
  styleUrls: ['./agregar-dona.page.scss'],
})
export class AgregarDonaPage implements OnInit {
  imagen: any = ""; 
  nombre: string = "";
  precio: number | null = null; 
  descripcion: string = "";
  stock: number | null = null; 
  disponibilidad: number | null = null; 

  constructor(
    private bd: ServicebdService, 
    private router: Router,
    private alertController: AlertController 
  ) { }

  ngOnInit() {}

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64, 
        source: CameraSource.Photos, 
      });

      this.imagen = `data:image/jpeg;base64,${image.base64String}`;
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  }

  async showAvailabilityOptions() {
    const alert = await this.alertController.create({
      header: 'Disponibilidad',
      message: '¿Está disponible el producto?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.disponibilidad = 1; 
          }
        },
        {
          text: 'No',
          handler: () => {
            this.disponibilidad = 2;  
          }
        }
      ]
    });

    await alert.present();
  }

  async validarYAgregar() {
    if (!this.nombre || this.precio === null || !this.descripcion || !this.imagen || this.stock === null || this.disponibilidad === null) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son obligatorios. Por favor, completa todos los datos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    this.insertar();
  }

  insertar() {
    if (this.nombre && this.precio !== null && this.descripcion && this.imagen && this.stock !== null && this.disponibilidad !== null) {
      this.bd.insertarDona(this.imagen, this.nombre, this.precio, this.descripcion, this.stock, this.disponibilidad)
        .then(() => {
          this.router.navigate(['/lista-donas']); 
        })
        .catch(error => {
          console.error('Error al agregar la dona:', error);
        });
    } else {
      console.error('Todos los campos son obligatorios.');
    }
  }

  
}
