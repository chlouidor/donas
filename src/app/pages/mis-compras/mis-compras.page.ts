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
    private servicebd: ServicebdService
  ) {}

  ngOnInit() {
    this.cargarCompras(); 
  }

  cargarCompras() {
    const user = this.registrologinService.getCurrentUser();
    const nombreCliente = user ? user.username : 'Cliente Desconocido';

    this.servicebd.fetchVentas().subscribe((ventas: any[]) => {
      this.compras = ventas.filter(venta => 
        venta.nombre_cliente.trim().toLowerCase() === nombreCliente.trim().toLowerCase()
      );

      this.compras.sort((a, b) => new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime());
    });
  }
}
