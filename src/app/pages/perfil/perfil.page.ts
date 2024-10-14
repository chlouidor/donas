import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  username: string | undefined; 
  email: string | undefined; 

  constructor(private router: Router, private registrologinService: RegistrologinService) {
    const user = this.registrologinService.getCurrentUser();
    if (user) {
      this.username = user.username; 
      this.email = user.email; 
    }
  }

  goToSettings() {
    this.router.navigate(['/configuracion']); 
  }

  logOut() {

    console.log('Sesión cerrada');
    this.router.navigate(['/login']); 
  }

  goToLogin() {
    this.router.navigate(['/login']); 
  }

  goTolistaDonas(){
    this.router.navigate(['/lista-donas']); 
  }
}
