import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Donas } from 'src/app/services/donas'; 
import { RegistrologinService } from 'src/app/services/registrologin.service'; // Importar el servicio

@Component({
  selector: 'app-lista-donas',
  templateUrl: './lista-donas.page.html',
  styleUrls: ['./lista-donas.page.scss'],
})
export class ListaDonasPage implements OnInit {

  listaDonas: Donas[] = [];
  isAdmin: boolean = false; // Variable para verificar si el usuario es admin

  constructor(private bd: ServicebdService, private router: Router, private registrologinService: RegistrologinService) { }

  ngOnInit() {
    // Verificar si el usuario es admin
    const user = this.registrologinService.getCurrentUser();
    this.isAdmin = user !== null && user.rol === 2; // Asegúrate de que user no sea null

    this.bd.dbState().subscribe((isReady) => {
      if (isReady) {
        this.bd.fetchDonas().subscribe(donas => {
          this.listaDonas = donas;
        });
      }
    });
  }

  modificar(dona: Donas) {
    let navigationExtras: NavigationExtras = {
      state: {
        dona: dona
      }
    };
    this.router.navigate(['/editar-dona'], navigationExtras);
  }

  eliminar(dona: Donas) {
    this.bd.eliminarDona(dona.iddona)
      .then(() => {
        this.listaDonas = this.listaDonas.filter(item => item.iddona !== dona.iddona);
      })
      .catch(error => {
        console.error('Error al eliminar la dona:', error);
      });
  }

  agregar() {
    this.router.navigate(['/agregar-dona']);
  }
}