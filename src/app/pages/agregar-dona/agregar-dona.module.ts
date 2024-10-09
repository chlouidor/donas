import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarDonaPageRoutingModule } from './agregar-dona-routing.module';

import { AgregarDonaPage } from './agregar-dona.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarDonaPageRoutingModule
  ],
  declarations: [AgregarDonaPage]
})
export class AgregarDonaPageModule {}
