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
  Imagen: string = '';
  Nombre: string = '';
  Precio: string = '';
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
        this.Nombre = this.router.getCurrentNavigation()?.extras.state?.['nom'];
        this.Precio = this.router.getCurrentNavigation()?.extras.state?.['pre'];
        this.Imagen = this.router.getCurrentNavigation()?.extras.state?.['imag'];

        const user = this.registrologinService.getCurrentUser();
        this.nombreCliente = user ? user.username : 'Cliente Desconocido';
        this.fechaEmision = new Date().toLocaleDateString(); 
        
       
        this.insertarVenta();
      }
    });
  }

  ngOnInit() {}

  
  insertarVenta() {
    const precioNumero = parseFloat(this.Precio); 
    this.servicebd.insertarVenta(this.nombreCliente, this.fechaEmision, this.Nombre, precioNumero)
      .then(() => {
        console.log("Venta registrada con éxito");
      })
      .catch(error => {
        console.error("Error al registrar la venta:", error);
      });
  }
}
