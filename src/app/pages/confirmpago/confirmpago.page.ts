import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { ServicebdService } from 'src/app/services/servicebd.service'; 

@Component({
  selector: 'app-confirmpago',
  templateUrl: './confirmpago.page.html',
  styleUrls: ['./confirmpago.page.scss'],
})
export class ConfirmpagoPage implements OnInit {
  carrito: any[] = []; 
  total: number = 0; 
  nombreCliente: string = ''; 
  fechaEmision: string = ''; 

  constructor(
    private router: Router,
    private activaterouter: ActivatedRoute,
    private registrologinService: RegistrologinService,
    private servicebd: ServicebdService
  ) {
    this.activaterouter.queryParams.subscribe(param => { 
      const state = this.router.getCurrentNavigation()?.extras.state;
    
      if (state) {
        this.carrito = state['carrito'] || [];
        this.nombreCliente = state['nombreCliente'] || 'Cliente Desconocido';

        const today = new Date();
        this.fechaEmision = state['fechaEmision'] || this.formatDate(today);

        this.carrito.forEach(item => {
          item.cantidad = item.cantidad || 1; 
        });
    
        this.calcularTotal();
        this.insertarVenta();
      } else {
        console.warn('No se recibieron datos del estado');
      }
    });
  }

  ngOnInit() {}

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  insertarVenta() {
    this.carrito.forEach((producto) => {
      this.servicebd.insertarVenta(
        this.nombreCliente,
        this.fechaEmision,
        producto.nombre,
        producto.cantidad,  
        producto.precio * producto.cantidad
      ).then(() => {
        console.log("Venta registrada correctamente.");
      }).catch(error => {
        console.error("Error al registrar la venta:", error);
      });
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    return `${day}-${month}-${year}`;
  }
}
