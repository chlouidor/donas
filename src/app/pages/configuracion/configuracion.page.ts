import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  username: string | undefined;
  email: string | undefined;
  updateError: boolean = false;

  constructor(private router: Router, private registrologinService: RegistrologinService) {}

  ngOnInit() {
    const user = this.registrologinService.getCurrentUser(); // Obtiene el usuario actual
    if (user) {
      this.username = user.username; // Asigna el nombre de usuario
      this.email = user.email; // Asigna el correo electrónico
    }
  }

  async actualizarDatos() {
    try {
      await this.registrologinService.actualizarUsuario(this.username!, this.email!); // Actualiza los datos en el servicio
      console.log('Datos actualizados con éxito');
      this.router.navigate(['/perfil']); // Redirigir a la página de perfil después de actualizar
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      this.updateError = true; // Muestra un mensaje de error si falla la actualización
    }
  }

  goToDonas(){
    this.router.navigate(['/lista-donas']); 
  }
}