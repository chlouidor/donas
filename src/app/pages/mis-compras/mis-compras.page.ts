import { Component, OnInit } from '@angular/core';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-mis-compras',
  templateUrl: './mis-compras.page.html',
  styleUrls: ['./mis-compras.page.scss'],
})
export class MisComprasPage implements OnInit {
  compras: any[] = [];
  
  constructor(
    private registrologinService: RegistrologinService,
    private servicebdService: ServicebdService
  ) {}

  ngOnInit() {
    const user = this.registrologinService.getCurrentUser();
    this.cargarCompras(user);
  }

  cargarCompras(user: any) {
    this.servicebdService.fetchVentas().subscribe(
      (ventas: any[]) => {
        // Filtrar y ordenar las compras según el usuario
        this.compras = ventas
          .filter(venta => venta.nombre_cliente === user.username)
          .sort((a, b) => new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime());
      },
      error => {
        console.error('Error al cargar las compras', error);
        this.compras = []; // En caso de error, se asigna un array vacío
      }
    );
  }
}

