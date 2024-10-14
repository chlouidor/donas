import { Component } from '@angular/core';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private registrologinService: RegistrologinService, private router: Router) {}

  async login() {
    const isValid = await this.registrologinService.loginUsuario(this.email, this.password);
    
    if (!isValid) {
      this.loginError = true; // Mostrar mensaje de error si las credenciales son incorrectas
    } else {
      this.loginError = false; // Ocultar mensaje de error si las credenciales son correctas
      // Redirigir o realizar otra acción al iniciar sesión correctamente
      this.router.navigate(['/perfil']); // Redirige a la página de perfil
    }
  }
}
