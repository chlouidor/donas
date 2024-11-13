import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Donas } from 'src/app/services/donas'; 

@Component({
  selector: 'app-lista-donas',
  templateUrl: './lista-donas.page.html',
  styleUrls: ['./lista-donas.page.scss'],
})
export class ListaDonasPage implements OnInit {

  listaDonas: Donas[] = [];

  constructor(private bd: ServicebdService, private router: Router) { }

  ngOnInit() {
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

  marcarNoDisponible(dona: Donas) {
    this.bd.marcarNoDisponible(dona.iddona)
      .then(() => {
        dona.disponible = 2;
      })
      .catch(error => {
        console.error('Error al marcar la dona como no disponible:', error);
      });
  }
  
  

  borrar(dona: Donas) {
    this.bd.borrarDona(dona.iddona)
      .then(() => {
        this.listaDonas = this.listaDonas.filter(item => item.iddona !== dona.iddona);
      })
      .catch(error => {
        console.error('Error al borrar la dona:', error);
      });
  }

  agregar() {
    this.router.navigate(['/agregar-dona']);
  }

  marcarComoDisponible(dona: Donas) {
    const nuevoEstado = dona.disponible === 1 ? 2 : 1;
  
    this.bd.marcarComoDisponible(dona.iddona, nuevoEstado)
      .then(() => {
        dona.disponible = nuevoEstado;  
        this.presentAlert('Actualizar', `Dona marcada como ${nuevoEstado === 1 ? 'disponible' : 'no disponible'}`);
      })
      .catch(error => {
        console.error('Error al marcar como disponible:', error);
      });
  }

  presentAlert(titulo: string, mensaje: string) {
  }
}
