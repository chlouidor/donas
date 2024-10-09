import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarDonaPage } from './editar-dona.page';

const routes: Routes = [
  {
    path: '',
    component: EditarDonaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarDonaPageRoutingModule {}
