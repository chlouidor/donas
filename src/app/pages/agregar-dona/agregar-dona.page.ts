import { Component, OnInit } from '@angular/core';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router'; 
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-agregar-dona',
  templateUrl: './agregar-dona.page.html',
  styleUrls: ['./agregar-dona.page.scss'],
})
export class AgregarDonaPage implements OnInit {
  imagen: any = ""; // Para almacenar la imagen seleccionada
  nombre: string = "";
  precio: any = "";
  descripcion: string = "";

  constructor(private bd: ServicebdService, private router: Router) { }

  ngOnInit() {}

  // Función para seleccionar imagen desde la cámara o galería
  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64, // Puedes cambiar a 'Uri' si prefieres usar la URI de la imagen
        source: CameraSource.Prompt, // Prompt para seleccionar entre cámara o galería
      });

      // Convertir la imagen a Base64 para almacenarla o mostrarla
      this.imagen = `data:image/jpeg;base64,${image.base64String}`;
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  }

  // Función para insertar la dona en la base de datos
  insertar() {
    if (this.nombre && this.precio && this.descripcion && this.imagen) {
      this.bd.insertarDona(this.imagen, this.nombre, this.precio, this.descripcion)
        .then(() => {
          this.router.navigate(['/lista-donas']); // Redirige a la lista de donas
        })
        .catch(error => {
          console.error('Error al agregar la dona:', error);
        });
    } else {
      console.error('Todos los campos son obligatorios.');
    }
  }
}
