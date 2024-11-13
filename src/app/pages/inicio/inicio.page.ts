import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { RegistrologinService } from 'src/app/services/registrologin.service'; // Importar el servicio
import { ToastController } from '@ionic/angular'; // Importar ToastController

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  listaDona: any[] = [
    {
      iddona: '',
      imagen: '',
      nombre: '',
      precio: '',
      descripcion: '',
      stock: '',
      disponible: '' 
    }
  ];

  constructor(
    private bd: ServicebdService,
    private router: Router,
    private registrologinService: RegistrologinService,
    private toastController: ToastController 
  ) {}

  ngOnInit() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchDonas().subscribe(res => {
          this.listaDona = res;
        });
      }
    });
  }

  async irPagina(index: number) {
    const user = this.registrologinService.getCurrentUser();
    
    if (!user) {
      const toast = await this.toastController.create({
        message: 'Para comprar necesitas iniciar sesión.',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      toast.present();

      this.router.navigate(['/login']); 
    } else {
      let donaSeleccionada = this.listaDona[index];
      
      if (donaSeleccionada.disponible === 1 && donaSeleccionada.stock > 0) {
        let navigationExtras: NavigationExtras = {
          state: {
            idona: donaSeleccionada.iddona,
            nom: donaSeleccionada.nombre,
            pre: donaSeleccionada.precio,
            imag: donaSeleccionada.imagen,
            sto: donaSeleccionada.stock,
          }
        };
        this.router.navigate(['/comprar'], navigationExtras);
      } else {
        const toast = await this.toastController.create({
          message: donaSeleccionada.stock === 0 
            ? 'Este producto está fuera de stock.'
            : 'Este producto no está disponible.',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
      }
    }
  }
}
