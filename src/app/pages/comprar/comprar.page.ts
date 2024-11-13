import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { AlertController } from '@ionic/angular';  // Importa AlertController

@Component({
  selector: 'app-comprar',
  templateUrl: './comprar.page.html',
  styleUrls: ['./comprar.page.scss'],
})
export class ComprarPage implements OnInit {
  iddona: number = 0;
  Imagen: string = '';
  Nombre: string = '';
  Precio: number = 0;
  stock: number =0;
  cantidadSeleccionada: number = 1;
  cantidades: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  nombreCliente: string | undefined;

  constructor(
    private router: Router,
    private activaterouter: ActivatedRoute,
    private registrologinService: RegistrologinService,
    private servicebd: ServicebdService,
    private alertController: AlertController  // Agrega el servicio de AlertController
  ) {
    this.activaterouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.iddona = this.router.getCurrentNavigation()?.extras.state?.['idona'];
        this.Nombre = this.router.getCurrentNavigation()?.extras.state?.['nom'];
        this.Precio = +this.router.getCurrentNavigation()?.extras.state?.['pre'];
        this.Imagen = this.router.getCurrentNavigation()?.extras.state?.['imag'];
        this.stock= this.router.getCurrentNavigation()?.extras.state?.['sto'];

        const user = this.registrologinService.getCurrentUser();
        this.nombreCliente = user ? user.username : 'Cliente Desconocido';
      }
    });
  }

  async carritocompra() {
    if (this.cantidadSeleccionada > this.stock) {
      const alert = await this.alertController.create({
        header: 'Stock insuficiente',
        message: `No hay suficiente stock para agregar ${this.cantidadSeleccionada} unidades de "${this.Nombre}".`,
        buttons: ['OK']
      });
      await alert.present();
      return; 
    }
  
    const producto = {
      iddona: this.iddona,
      imagen: this.Imagen,
      nombre: this.Nombre,
      precio: this.Precio,
    };

    this.servicebd.agregarAlCarrito(producto, this.cantidadSeleccionada);
  
    const alert = await this.alertController.create({
      header: 'Producto Agregado',
      message: `El producto "${this.Nombre}" ha sido agregado al carrito.`,
      buttons: ['OK']
    });
    await alert.present();

    this.router.navigate(['/inicio']);
  }
  
  

  ngOnInit() {}
}
