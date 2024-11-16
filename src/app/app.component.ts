import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { RegistrologinService } from './services/registrologin.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    public registrologinService: RegistrologinService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const sessionRestored = await this.registrologinService.restoreSession();
    if (sessionRestored) {
      console.log('Sesión restaurada exitosamente.');
      this.router.navigate(['/inicio']); 
    } else {
      console.log('No hay sesión activa.');
      this.router.navigate(['/inicio']); 
    }
  }

  goToInicio() {
    this.router.navigate(['/inicio']);
    this.menuCtrl.close();
  }

  goToNosotros() {
    this.router.navigate(['/nosotros']);
    this.menuCtrl.close();
  }

  goToPrecios() {
    this.router.navigate(['/precios']);
    this.menuCtrl.close();
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
    this.menuCtrl.close();
  }
}
