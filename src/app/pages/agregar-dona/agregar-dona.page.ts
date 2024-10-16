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
  imagen: any = "";
  nombre: string = "";
  precio: any = "";
  descripcion: string = "";

  constructor(private bd: ServicebdService, private router: Router) { } 

  ngOnInit() {}

  
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos  
    });

    this.imagen = image.webPath;  
  }

  insertar() {
    this.bd.insertarDona(this.imagen, this.nombre, this.precio, this.descripcion)
      .then(() => {
        this.router.navigate(['/lista-donas']);
      })
      .catch(error => {
        console.error('Error al agregar la dona:', error);
      });
  }
}
