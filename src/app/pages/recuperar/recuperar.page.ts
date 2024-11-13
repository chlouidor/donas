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
  emailSent: boolean = false;
  recoveryError: boolean = false;

  constructor(
    private router: Router,
    private registrologinService: RegistrologinService,
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  // async sendRecoveryEmail() {
  //   // Validación de correo
  //   if (this.email.trim() === '' || !this.validateEmail(this.email)) {
  //     this.showAlert('Error', 'Por favor, introduce un correo electrónico válido.');
  //     return;
  //   }

  //   // Verifica si el correo existe en la base de datos
  //   const emailExists = await this.registrologinService.checkEmailExists(this.email);

  //   if (emailExists) {
  //     this.emailSent = true;
  //     this.recoveryError = false;
  //     await this.registrologinService.sendRecoveryLink(this.email);
  //     this.showAlert('Enviado', 'Hemos enviado un enlace de recuperación a tu correo.');
  //   } else {
  //     this.recoveryError = true;
  //     this.showAlert('Error', 'No se ha encontrado una cuenta asociada a este correo.');
  //   }
  // }

  // goToLogin() {
  //   this.router.navigate(['/login']);
  // }

  // // Función para mostrar alertas
  // async showAlert(header: string, message: string) {
  //   const alert = await this.alertController.create({
  //     header,
  //     message,
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }

  // // Validación de formato de correo electrónico
  // validateEmail(email: string): boolean {
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return regex.test(email);
  // }
}
