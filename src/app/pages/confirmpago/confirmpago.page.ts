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
      if (this.router.getCurrentNavigation()?.extras.state) {
        const state = this.router.getCurrentNavigation()?.extras.state;
        this.carrito = state?.['carrito'] || [];
        this.nombreCliente = state?.['nombreCliente'] || 'Cliente Desconocido';
        this.fechaEmision = state?.['fechaEmision'] || new Date().toLocaleDateString();
        
        this.calcularTotal();
        this.insertarVenta();
      }
    });
  }

  ngOnInit() {}

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  insertarVenta() {
    this.carrito.forEach((producto) => {
      this.servicebd.insertarVenta(this.nombreCliente, this.fechaEmision, producto.nombre, producto.precio * producto.cantidad)
        .then(() => {
          console.log("Venta registrada correctamente.");
        })
        .catch(error => {
          console.error("Error al registrar la venta:", error);
        });
    });
  }
}


