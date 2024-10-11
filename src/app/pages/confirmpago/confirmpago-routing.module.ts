import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmpagoPage } from './confirmpago.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmpagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmpagoPageRoutingModule {}
