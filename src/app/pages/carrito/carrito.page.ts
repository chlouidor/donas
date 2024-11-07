import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { RegistrologinService } from 'src/app/services/registrologin.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: any[] = []; 
  total: number = 0; 

  constructor(private servicebd: ServicebdService, private router: Router, private registrologinService: RegistrologinService) { }

  ngOnInit() {
    this.obtenerCarrito();
  }

  obtenerCarrito() {
    const productosCarrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.carrito = productosCarrito;
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito)); 
    this.calcularTotal();
  }

 
  confirmarCompra() {
    const user = this.registrologinService.getCurrentUser();
    const nombreCliente = user ? user.username : 'Cliente Desconocido';
    const fechaEmision = new Date().toISOString();

    this.router.navigate(['/confirmpago'], {
      state: {
        carrito: this.carrito,
        nombreCliente,
        fechaEmision,
      }
    });

    localStorage.setItem('carrito', JSON.stringify([]));
  }
}
