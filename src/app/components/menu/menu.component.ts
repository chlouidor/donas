import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service'; // Importar el servicio

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(public router: Router, public registrologinService: RegistrologinService) {} 

  goToInicio() {
    this.router.navigate(['/inicio']);
  }

  goToNosotros() {
    this.router.navigate(['/nosotros']);
  }

  goToPrecios() {
    this.router.navigate(['/precios']); 
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  goToCarrito() {
    this.router.navigate(['/carrito']); 
  }



  ngOnInit() {}
}
