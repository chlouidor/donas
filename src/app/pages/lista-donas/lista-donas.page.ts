import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-lista-donas',
  templateUrl: './lista-donas.page.html',
  styleUrls: ['./lista-donas.page.scss'],
})
export class ListaDonasPage implements OnInit {

  constructor(private bd: ServicebdService, private router: Router) { }

  ngOnInit() {
  }

  modificar(x:any){
    let navigationsExtras: NavigationExtras = {
      state: {
        noticia: x
      }
    }
    this.router.navigate(['/editar-dona'], navigationsExtras);

  }
  eliminar(x:any){
    this.bd.eliminarDona(x.idnoticia);
  }

  agregar(){
    this.router.navigate(['/agregar-dona']);
  }
}
