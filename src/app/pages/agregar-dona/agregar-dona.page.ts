import { Component, OnInit } from '@angular/core';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-agregar-dona',
  templateUrl: './agregar-dona.page.html',
  styleUrls: ['./agregar-dona.page.scss'],
})
export class AgregarDonaPage implements OnInit {
  imagen: string = "";
  nombre: string = "";
  precio: any ="";
  descripcion: string = "";

  constructor( private bd: ServicebdService) { }

  ngOnInit() {
  }

  insertar(){
    this.bd.insertarDona(this.imagen, this.nombre, this.precio, this.descripcion, );
  }
}
