import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrologinService } from 'src/app/services/registrologin.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  email: string = '';
  pregunta: string = '';
  respuesta: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  fase: number = 1;

  constructor(
    private router: Router,
    private registrologinService: RegistrologinService,
    private alertController: AlertController
  ) { }

  hasNumber(str: string): boolean {
    return /\d/.test(str);
  }

  ngOnInit() {}

  async showAlert(title: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async verificarEmail() {
    try {
      const result = await this.registrologinService.obtenerPreguntasPorEmail(this.email);
      if (result && result.pregunta) {
        this.pregunta = result.pregunta;
        this.fase = 2;
      } else {
        await this.showAlert('Error', 'Usuario no puede recuperar clave');
        this.fase = 1;
      }
    } catch (error) {
      await this.showAlert('Error', 'Hubo un problema al verificar el email.');
      this.fase = 1;
    }
  }

  async verificarPregunta() {
    if (!this.respuesta || this.respuesta.trim() === '') {
      await this.showAlert('Error', 'Por favor ingrese la respuesta a la pregunta de seguridad.');
      return;
    }
  
    this.respuesta = this.respuesta.toLowerCase();
  
    const respuestaCorrecta = await this.registrologinService.recuperarContrasena(this.email, this.pregunta, this.respuesta);
    if (respuestaCorrecta) {
      this.fase = 3;
    } else {
      await this.showAlert('Error', 'Respuesta incorrecta.');
    }
  }
  

  async cambiarContrasena() {
    if (this.nuevaContrasena.trim() === '') {
      this.showAlert('Error', 'El campo de contraseña no puede estar vacío.');
      return;
    }

    if (this.nuevaContrasena.length < 6) {
      this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!this.hasNumber(this.nuevaContrasena)) {
      this.showAlert('Error', 'La contraseña debe contener al menos un número.');
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    await this.registrologinService.cambiarContrasenaPorEmail(this.email, this.nuevaContrasena);
    this.showAlert('Éxito', 'Contraseña cambiada con éxito.');
    this.router.navigate(['/login']);
  }
}
