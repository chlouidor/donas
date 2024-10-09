import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoximosPageRoutingModule } from './poximos-routing.module';

import { PoximosPage } from './poximos.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    PoximosPageRoutingModule
  ],
  declarations: [PoximosPage]
})
export class PoximosPageModule {}
