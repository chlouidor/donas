import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Donas } from 'src/app/services/donas';  
import { RegistrologinService } from 'src/app/services/registrologin.service'; // Importar el servicio

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
    descripcion: ''
  };

  constructor(
    private router: Router,
    private activedrouter: ActivatedRoute,
    private bd: ServicebdService,
    private registrologinService: RegistrologinService // Inyectar el servicio
  ) {
    const user = this.registrologinService.getCurrentUser();
    
    // Verificar si el usuario es admin
    if (!user || user.rol !== 2) { // Suponiendo que '2' es el rol para admin
      this.router.navigate(['/inicio']); // Redirigir si no es admin
      return; // Salir del constructor
    }

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
      this.dona.descripcion
    ).then(() => {
      this.router.navigate(['/lista-donas']);  
    }).catch(error => {
      console.error('Error al modificar la dona:', error);
    });
  }
}