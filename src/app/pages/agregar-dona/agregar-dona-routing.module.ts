import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarDonaPage } from './agregar-dona.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarDonaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarDonaPageRoutingModule {}
