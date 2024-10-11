import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmpagoPageRoutingModule } from './confirmpago-routing.module';

import { ConfirmpagoPage } from './confirmpago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmpagoPageRoutingModule
  ],
  declarations: [ConfirmpagoPage]
})
export class ConfirmpagoPageModule {}
