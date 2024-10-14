import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-editar-dona',
  templateUrl: './editar-dona.page.html',
  styleUrls: ['./editar-dona.page.scss'],
})
export class EditarDonaPage implements OnInit {

  dona: any;

  constructor(private router: Router, private activedrouter: ActivatedRoute, private bd: ServicebdService) {
    this.activedrouter.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.dona = this.router.getCurrentNavigation()?.extras?.state?.['noticia'];
      }
    })
   }

  ngOnInit() {
  }

  modificar(){
    this.bd.modificarDona(this.dona.iddona,this.dona.imagen, this.dona.nombre, this.dona.precio, this.dona.descripcion);
  }

}
