import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaDonasPageRoutingModule } from './lista-donas-routing.module';

import { ListaDonasPage } from './lista-donas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaDonasPageRoutingModule
  ],
  declarations: [ListaDonasPage]
})
export class ListaDonasPageModule {}
