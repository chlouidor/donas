import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { RegistrologinService } from 'src/app/services/registrologin.service'; // Importar el servicio

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  listaDona: any[] = [
    {
      iddona: '',
      imagen: '',
      nombre: '',
      precio: '',
      descripcion: ''
    }
  ];

  constructor(private bd: ServicebdService, private router: Router, private registrologinService: RegistrologinService) { }

  ngOnInit() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchDonas().subscribe(res => {
          this.listaDona = res;
        });
      }
    });
  }

  irPagina(index: number) {
    // Verificar si el usuario está logueado
    const user = this.registrologinService.getCurrentUser();
    
    if (!user) {
      // Si no está logueado, redirigir al perfil
      this.router.navigate(['/perfil']);
    } else {
      // Si está logueado, proceder a la compra
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
}