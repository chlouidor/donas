import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { RegistrologinService } from './services/registrologin.service'; // Importa el servicio

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private menuCtrl: MenuController, public registrologinService: RegistrologinService ){}

  goToInicio() {
    this.router.navigate(['/inicio']);
    this.menuCtrl.close(); 
  }

  goToNosotros() {
    this.router.navigate(['/nosotros']);
    this.menuCtrl.close(); 
  }

  goToProximos() {
    this.router.navigate(['/proximos']);
    this.menuCtrl.close(); 
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
    this.menuCtrl.close();
  }
}
