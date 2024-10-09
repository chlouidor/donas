import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoximosPage } from './poximos.page';

const routes: Routes = [
  {
    path: '',
    component: PoximosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoximosPageRoutingModule {}
