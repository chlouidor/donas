import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { CarritoService } from 'src/app/services/carrito.service';  // Importa el servicio
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-comprar',
  templateUrl: './comprar.page.html',
  styleUrls: ['./comprar.page.scss'],
})
export class ComprarPage implements OnInit {
  iddona: number =0;
  Imagen: string = '';
  Nombre: string = '';
  Precio: number = 0;
  cantidadSeleccionada: number = 1;
  cantidades: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  nombreCliente: string | undefined;

  constructor(
    private router: Router,
    private activaterouter: ActivatedRoute,
    private registrologinService: RegistrologinService,
    private servicebd:ServicebdService,
    private carritoService: CarritoService  
  ) {
    this.activaterouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.iddona = this.router.getCurrentNavigation()?.extras.state?.['idona'];
        this.Nombre = this.router.getCurrentNavigation()?.extras.state?.['nom'];
        this.Precio = +this.router.getCurrentNavigation()?.extras.state?.['pre'];
        this.Imagen = this.router.getCurrentNavigation()?.extras.state?.['imag'];

        const user = this.registrologinService.getCurrentUser();
        this.nombreCliente = user ? user.username : 'Cliente Desconocido';
      }
    });
  }

  carritocompra() {
    const producto = {
      iddona: this.iddona,
      imagen: this.Imagen,
      nombre: this.Nombre,
      precio: this.Precio,
    };
    this.servicebd.agregarAlCarrito(producto, this.cantidadSeleccionada);
    this.router.navigate(['/inicio']);
  }

  confirmarPago() {
    const total = (this.Precio * this.cantidadSeleccionada).toFixed(3);
    let navigationExtras = {
      state: {
        nom: this.Nombre,
        pre: parseFloat(total),
        imag: this.Imagen,
        nombreCliente: this.nombreCliente
      }
    };
    this.router.navigate(['/confirmpago'], navigationExtras);
  }

  ngOnInit() {}
}
