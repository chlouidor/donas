import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarDonaPageRoutingModule } from './editar-dona-routing.module';

import { EditarDonaPage } from './editar-dona.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    EditarDonaPageRoutingModule
  ],
  declarations: [EditarDonaPage]
})
export class EditarDonaPageModule {}
