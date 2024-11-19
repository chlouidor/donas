import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.page.html',
  styleUrls: ['./nosotros.page.scss'],
})
export class NosotrosPage implements OnInit {

  constructor(private inAppBrowser: InAppBrowser) { }

  ngOnInit() {
  }

  openInstagram() {
    const browser = this.inAppBrowser.create('https://www.instagram.com/idkcloudd_/', '_system');
  }
}
