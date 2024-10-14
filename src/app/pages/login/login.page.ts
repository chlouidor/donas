import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router, private registrologinService: RegistrologinService) {}

  async login() {
    const isValid = await this.registrologinService.loginUsuario(this.email, this.password);
    
    if (!isValid) {
      this.loginError = true;
    } else {
      this.loginError = false;
      this.router.navigate(['/perfil']); // Redirigir a la página de perfil al iniciar sesión correctamente
    }
  }

  goToRegister() {
    this.router.navigate(['/registro']); // Método para navegar a la página de registro
  }
}
