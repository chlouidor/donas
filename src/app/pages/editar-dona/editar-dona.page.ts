import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Donas } from 'src/app/services/donas';  

@Component({
  selector: 'app-editar-dona',
  templateUrl: './editar-dona.page.html',
  styleUrls: ['./editar-dona.page.scss'],
})
export class EditarDonaPage implements OnInit {

  dona: Donas = {
    iddona: 0,
    imagen: '',
    nombre: '',
    precio: 0,
    descripcion: '',
    stock: 0,      
    disponible: 1   
  };

  constructor(
    private router: Router, 
    private activedrouter: ActivatedRoute, 
    private bd: ServicebdService
  ) {
    this.activedrouter.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.dona = this.router.getCurrentNavigation()?.extras?.state?.['dona'];  
      }
    });
  }

  ngOnInit() {}


  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos 
    });

    this.dona.imagen = image.webPath;  
  }

  modificar() {
    this.bd.modificarDona(
      this.dona.iddona, 
      this.dona.imagen, 
      this.dona.nombre, 
      this.dona.precio, 
      this.dona.descripcion,
      this.dona.stock  
    ).then(() => {
      this.router.navigate(['/lista-donas']);  
    }).catch(error => {
      console.error('Error al modificar la dona:', error);
    });
  }
  
}