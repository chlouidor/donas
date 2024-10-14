import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-lista-donas',
  templateUrl: './lista-donas.page.html',
  styleUrls: ['./lista-donas.page.scss'],
})
export class ListaDonasPage implements OnInit {

  listaDonas: any[] = [
    {
      id: '1',
      imagen: 'ruta-imagen-1.jpg',
      nombre: 'Dona de Chocolate',
      precio: '10.00',
      descripcion: 'Dona deliciosa de chocolate.'
    },
    {
      id: '2',
      imagen: 'ruta-imagen-2.jpg',
      nombre: 'Dona Glaseada',
      precio: '8.00',
      descripcion: 'Dona con glaseado de azúcar.'
    }
  ];

  constructor(private bd: ServicebdService, private router: Router) { }

  ngOnInit() {
  }

  modificar(dona: any) {
    let navigationsExtras: NavigationExtras = {
      state: {
        dona: dona
      }
    };
    this.router.navigate(['/editar-dona'], navigationsExtras);
  }

  eliminar(dona: any) {
    this.bd.eliminarDona(dona.id)
      .then(() => {
        this.listaDonas = this.listaDonas.filter(item => item.id !== dona.id);
      })
      .catch(error => {
        console.error('Error al eliminar la dona:', error);
      });
  }

  agregar() {
    this.router.navigate(['/agregar-dona']);
  }
}
