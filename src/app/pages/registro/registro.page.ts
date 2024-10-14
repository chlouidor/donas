import { Component } from '@angular/core';
import { RegistrologinService } from 'src/app/services/registrologin.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  confirmPasswordError: boolean = false;

  constructor(private registrologinService: RegistrologinService) {}

  registrar() {
    this.confirmPasswordError = this.password !== this.confirmPassword;

    if (!this.confirmPasswordError) {
      this.registrologinService.registrarUsuario(this.username, this.email, this.password);
      // Lógica para redirigir al usuario después del registro exitoso
      console.log('Registro exitoso');
      // Ejemplo de redirección:
      // this.router.navigate(['/login']);
    }
  }
}
