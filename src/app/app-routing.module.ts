import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'compras',
    loadChildren: () => import('./pages/compras/compras.module').then( m => m.ComprasPageModule)
  },
  {
    path: 'agregar-dona',
    loadChildren: () => import('./pages/agregar-dona/agregar-dona.module').then( m => m.AgregarDonaPageModule)
  },
  {
    path: 'editar-dona',
    loadChildren: () => import('./pages/editar-dona/editar-dona.module').then( m => m.EditarDonaPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'session',
    loadChildren: () => import('./pages/session/session.module').then( m => m.SessionPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'nosotros',
    loadChildren: () => import('./pages/nosotros/nosotros.module').then( m => m.NosotrosPageModule)
  },
  {
    path: 'poximos',
    loadChildren: () => import('./pages/poximos/poximos.module').then( m => m.PoximosPageModule)
  },

  {
    path: 'comprar',
    loadChildren: () => import('./pages/comprar/comprar.module').then( m => m.ComprarPageModule)
  },
  {
    path: 'confirmpago',
    loadChildren: () => import('./pages/confirmpago/confirmpago.module').then( m => m.ConfirmpagoPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found', 
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
