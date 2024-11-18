import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Donas } from 'src/app/services/donas';
import { AlertController } from '@ionic/angular';

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
    private bd: ServicebdService,
    private alertCtrl: AlertController 
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

  async validarYModificar() {
    if (!this.dona.imagen || !this.dona.nombre || !this.dona.precio || !this.dona.descripcion || !this.dona.stock) {
      const alert = await this.alertCtrl.create({
        header: 'Campos Vacíos',
        message: 'Todos los campos son obligatorios.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    this.modificar();
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
