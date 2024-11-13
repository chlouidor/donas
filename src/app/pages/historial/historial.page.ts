import { Component, OnInit } from '@angular/core';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  compras: any[] = [];

  constructor(private servicebd: ServicebdService) { }

  ngOnInit() {
    this.cargarCompras();
  }

  cargarCompras() {
    this.servicebd.fetchVentas().subscribe((ventas: any[]) => {
      this.compras = ventas.sort((a, b) => {
        const fechaA = new Date(a.fecha_emision);
        const fechaB = new Date(b.fecha_emision);
        return fechaB.getTime() - fechaA.getTime();
      });
    });
  }
}
