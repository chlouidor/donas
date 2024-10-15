import { Component, OnInit } from '@angular/core';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-agregar-dona',
  templateUrl: './agregar-dona.page.html',
  styleUrls: ['./agregar-dona.page.scss'],
})
export class AgregarDonaPage implements OnInit {
  imagen: string = "";
  nombre: string = "";
  precio: any = "";
  descripcion: string = "";

  constructor(private bd: ServicebdService, private router: Router) { } // Inyecta Router

  ngOnInit() {
  }

  insertar() {
    this.bd.insertarDona(this.imagen, this.nombre, this.precio, this.descripcion)
      .then(() => {
        this.router.navigate(['/lista-donas']);
      })
      .catch(error => {
        console.error('Error al agregar la dona:', error);
      });
  }
}
