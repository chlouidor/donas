import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) {}

  login() {
    if (this.email && this.password) {
      console.log('Sesión iniciada');
      this.navCtrl.navigateRoot('/home');  // Redirige a la página principal
    }
  }
}
