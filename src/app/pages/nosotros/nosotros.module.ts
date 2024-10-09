import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NosotrosPageRoutingModule } from './nosotros-routing.module';

import { NosotrosPage } from './nosotros.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    NosotrosPageRoutingModule
  ],
  declarations: [NosotrosPage]
})
export class NosotrosPageModule {}
