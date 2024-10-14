import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { RegistrologinService } from 'src/app/services/registrologin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loginError: boolean = false; // Inicializar el mensaje de error

  constructor(private registrologinService: RegistrologinService, private router: Router) {} // Inyectar Router

  async login() {
    const isValid = await this.registrologinService.loginUsuario(this.email, this.password);
    
    if (!isValid) {
      this.loginError = true; // Mostrar mensaje de error si las credenciales son incorrectas
    } else {
      this.loginError = false; // Ocultar mensaje de error si las credenciales son correctas
      // Redirigir o realizar otra acción al iniciar sesión correctamente
      console.log('Inicio de sesión exitoso');
      // Aquí podrías usar el Router para redirigir al usuario
      // this.router.navigate(['/pagina-principal']);
    }
  }

  // Función para redirigir a la página de registro
  irARegistro() {
    this.router.navigate(['/registro']); // Asegúrate de que la ruta '/registro' sea la correcta
  }
}
