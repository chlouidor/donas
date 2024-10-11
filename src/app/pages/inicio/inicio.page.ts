import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  listaDona: any = [
    {
      iddona: '',
      imagen: '',
      nombre: '',
      precio: '',
      descripcion: ''
    }
  ]


  constructor(private bd: ServicebdService, private router: Router) { }

  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      if(data){
        this.bd.fetchDonas().subscribe(res=>{
          this.listaDona = res;
        })
      }
    })
  }

  irPagina(index: number) {
    let donaSeleccionada = this.listaDona[index];
    let navigationExtras: NavigationExtras = {
      state: {
        nom: donaSeleccionada.nombre,
        pre: donaSeleccionada.precio,
        imag: donaSeleccionada.imagen
      }
    };
    this.router.navigate(['/comprar'], navigationExtras);
  }
  

}
